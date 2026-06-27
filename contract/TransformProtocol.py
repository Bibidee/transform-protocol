# { "Depends": "py-genlayer:1jb45aa8ynh2a9c9xn3b7qqh8sm5q93hwfp7jqmwsfhh8jpz09h6" }

from genlayer import *
import json
import hashlib
from datetime import datetime, timezone

# ---------------------------------------------------------------------------
# TransformProtocol — GenLayer Intelligent Contract
#
# Decentralised consensus for transformation readiness.
# Evaluates organisational signals, stakeholder resistance, incentive
# alignment, implementation plans, and public evidence to produce
# canonical, confidence-scored Transformation Readiness Verdicts.
# ---------------------------------------------------------------------------

MAX_SIGNALS = 20
MAX_EVIDENCE = 20
MAX_DOMAINS = 11

ALLOWED_VERDICT_LABELS = {
    "READY_TO_PROCEED",
    "READY_AFTER_READINESS_SPRINT",
    "CONDITIONALLY_READY",
    "NOT_READY_REDESIGN_REQUIRED",
    "INSUFFICIENT_EVIDENCE",
}

ALLOWED_RISK_LEVELS = {"LOW", "MEDIUM", "MEDIUM_HIGH", "HIGH", "CRITICAL"}

ALLOWED_ALIGNMENT_LEVELS = {"STRONG", "MODERATE", "PARTIAL", "WEAK", "ABSENT"}

ALLOWED_QUALITY_LEVELS = {"HIGH", "MEDIUM_HIGH", "MEDIUM", "LOW", "INSUFFICIENT"}

ALLOWED_CONTRADICTION_LEVELS = {
    "NONE", "LOW", "MODERATE", "HIGH", "IRRECONCILABLE"
}

ALLOWED_DOMAINS = {
    "LEADERSHIP_ALIGNMENT",
    "MIDDLE_MANAGEMENT_ALIGNMENT",
    "STAKEHOLDER_RESISTANCE",
    "INCENTIVE_ALIGNMENT",
    "CULTURE_READINESS",
    "PROCESS_MATURITY",
    "DATA_READINESS",
    "TECHNOLOGY_READINESS",
    "TRAINING_READINESS",
    "COMMUNICATION_READINESS",
    "DELIVERY_CAPACITY",
}


def to_json(value) -> str:
    return json.dumps(value, sort_keys=True, separators=(",", ":"))


def safe_loads(raw: str, fallback):
    if not raw:
        return fallback
    try:
        return json.loads(raw)
    except Exception:
        return fallback


def utcnow() -> str:
    return datetime.now(timezone.utc).isoformat()


def sha256_hex(value: str) -> str:
    return "0x" + hashlib.sha256(value.encode("utf-8")).hexdigest()


def clamp_str(s: str, max_len: int = 1000) -> str:
    return str(s or "")[:max_len]


class TransformProtocol(gl.Contract):
    # State storage
    cases: TreeMap[str, str]         # case_id -> JSON
    case_ids: str                    # JSON array
    owner_cases: TreeMap[str, str]   # owner_address -> JSON array of case IDs
    stats: str                       # JSON stats

    def __init__(self) -> None:
        self.cases = TreeMap()
        self.case_ids = to_json([])
        self.owner_cases = TreeMap()
        self.stats = to_json({
            "total_cases": 0,
            "total_verdicts": 0,
            "total_signals": 0,
            "total_evidence": 0,
        })

    # -----------------------------------------------------------------------
    # Create Transformation Case
    # -----------------------------------------------------------------------

    @gl.public.write
    def create_case(self, case_id: str, packet_json: str) -> str:
        assert case_id, "case_id required"
        assert case_id not in self.cases, "Case ID already exists"
        assert packet_json, "packet_json required"

        packet = safe_loads(packet_json, {})
        owner = str(gl.message.sender_address)

        record = {
            "case_id": case_id,
            "title": clamp_str(packet.get("title", ""), 200),
            "organisation": clamp_str(packet.get("organisation", ""), 200),
            "industry": clamp_str(packet.get("industry", ""), 100),
            "transformation_type": clamp_str(packet.get("transformation_type", ""), 100),
            "current_state": clamp_str(packet.get("current_state", ""), 800),
            "target_state": clamp_str(packet.get("target_state", ""), 800),
            "business_objective": clamp_str(packet.get("business_objective", ""), 800),
            "scope": clamp_str(packet.get("scope", ""), 600),
            "implementation_timeline": clamp_str(packet.get("implementation_timeline", ""), 200),
            "decision_deadline": clamp_str(packet.get("decision_deadline", ""), 200),
            "stakeholder_groups": clamp_str(packet.get("stakeholder_groups", ""), 500),
            "known_constraints": clamp_str(packet.get("known_constraints", ""), 800),
            "risk_hypothesis": clamp_str(packet.get("risk_hypothesis", ""), 800),
            "evidence_summary": clamp_str(packet.get("evidence_summary", ""), 1000),
            "status": "OPEN",
            "owner": owner,
            "created_at": utcnow(),
            "implementation_plan": None,
            "signals": [],
            "domains": [],
            "evidence": [],
            "verdicts": [],
        }

        self.cases[case_id] = to_json(record)

        # Update case_ids index
        ids = safe_loads(self.case_ids, [])
        if case_id not in ids:
            ids.append(case_id)
        self.case_ids = to_json(ids)

        # Update owner index
        existing_raw = self.owner_cases.get(owner, "[]")
        existing = safe_loads(existing_raw, [])
        if case_id not in existing:
            existing.append(case_id)
        self.owner_cases[owner] = to_json(existing)

        # Update stats
        stats = safe_loads(self.stats, {})
        stats["total_cases"] = stats.get("total_cases", 0) + 1
        self.stats = to_json(stats)

        return to_json({"ok": True, "case_id": case_id, "status": "OPEN"})

    # -----------------------------------------------------------------------
    # Add Implementation Plan
    # -----------------------------------------------------------------------

    @gl.public.write
    def add_implementation_plan(self, case_id: str, plan_json: str) -> str:
        assert case_id in self.cases, "Case not found"
        assert plan_json, "plan_json required"

        case = safe_loads(self.cases[case_id], {})
        caller = str(gl.message.sender_address)
        assert case.get("owner", "").lower() == caller.lower(), "Only the case owner can add a plan"
        assert case.get("implementation_plan") is None, "Implementation plan already submitted"

        plan = safe_loads(plan_json, {})
        plan_record = {
            "plan_title": clamp_str(plan.get("plan_title", ""), 200),
            "objective": clamp_str(plan.get("objective", ""), 800),
            "delivery_phases": clamp_str(plan.get("delivery_phases", ""), 1000),
            "milestones": clamp_str(plan.get("milestones", ""), 1000),
            "responsible_teams": clamp_str(plan.get("responsible_teams", ""), 500),
            "dependency_map": clamp_str(plan.get("dependency_map", ""), 800),
            "training_approach": clamp_str(plan.get("training_approach", ""), 800),
            "communication_approach": clamp_str(plan.get("communication_approach", ""), 800),
            "governance_approach": clamp_str(plan.get("governance_approach", ""), 800),
            "budget_assumption": clamp_str(plan.get("budget_assumption", ""), 400),
            "timeline_assumption": clamp_str(plan.get("timeline_assumption", ""), 400),
            "success_criteria": clamp_str(plan.get("success_criteria", ""), 800),
            "known_risks": clamp_str(plan.get("known_risks", ""), 800),
            "mitigation_plan": clamp_str(plan.get("mitigation_plan", ""), 800),
            "failure_conditions": clamp_str(plan.get("failure_conditions", ""), 600),
            "added_at": utcnow(),
            "added_by": caller,
        }

        case["implementation_plan"] = plan_record
        self.cases[case_id] = to_json(case)
        return to_json({"ok": True, "case_id": case_id})

    # -----------------------------------------------------------------------
    # Add Stakeholder Signal
    # -----------------------------------------------------------------------

    @gl.public.write
    def add_signal(self, case_id: str, signal_id: str, signal_json: str) -> str:
        assert case_id in self.cases, "Case not found"
        assert signal_id, "signal_id required"
        assert signal_json, "signal_json required"

        case = safe_loads(self.cases[case_id], {})
        caller = str(gl.message.sender_address)
        assert case.get("owner", "").lower() == caller.lower(), "Only the case owner can add signals"
        signals = case.get("signals", [])
        assert len(signals) < MAX_SIGNALS, f"Maximum {MAX_SIGNALS} signals per case"

        sig = safe_loads(signal_json, {})
        signal_record = {
            "signal_id": signal_id,
            "title": clamp_str(sig.get("title", ""), 200),
            "stakeholder_group": clamp_str(sig.get("stakeholder_group", ""), 100),
            "signal_type": clamp_str(sig.get("signal_type", ""), 100),
            "readiness_implication": clamp_str(sig.get("readiness_implication", ""), 600),
            "resistance_level": sig.get("resistance_level", "NONE"),
            "confidence_level": sig.get("confidence_level", "MEDIUM"),
            "evidence_url": clamp_str(sig.get("evidence_url", ""), 500),
            "source_credibility_note": clamp_str(sig.get("source_credibility_note", ""), 400),
            "related_domain": clamp_str(sig.get("related_domain", ""), 100),
            "added_at": utcnow(),
            "added_by": caller,
        }

        signals.append(signal_record)
        case["signals"] = signals
        self.cases[case_id] = to_json(case)

        stats = safe_loads(self.stats, {})
        stats["total_signals"] = stats.get("total_signals", 0) + 1
        self.stats = to_json(stats)

        return to_json({"ok": True, "signal_id": signal_id})

    # -----------------------------------------------------------------------
    # Add Readiness Domain
    # -----------------------------------------------------------------------

    @gl.public.write
    def add_domain(self, case_id: str, domain_name: str, domain_json: str) -> str:
        assert case_id in self.cases, "Case not found"
        assert domain_name in ALLOWED_DOMAINS, f"Invalid domain: {domain_name}"
        assert domain_json, "domain_json required"

        case = safe_loads(self.cases[case_id], {})
        caller = str(gl.message.sender_address)
        assert case.get("owner", "").lower() == caller.lower(), "Only the case owner can add domains"
        domains = case.get("domains", [])
        assert len(domains) < MAX_DOMAINS, "All 11 domains already assessed"

        # Prevent duplicate domain
        existing_names = [d.get("domain_name") for d in domains]
        assert domain_name not in existing_names, "Domain already assessed"

        dom = safe_loads(domain_json, {})
        domain_record = {
            "domain_name": domain_name,
            "self_assessed_level": dom.get("self_assessed_level", "MODERATE"),
            "evidence_url": clamp_str(dom.get("evidence_url", ""), 500),
            "notes": clamp_str(dom.get("notes", ""), 600),
            "added_at": utcnow(),
            "added_by": caller,
        }

        domains.append(domain_record)
        case["domains"] = domains
        self.cases[case_id] = to_json(case)
        return to_json({"ok": True, "domain_name": domain_name})

    # -----------------------------------------------------------------------
    # Add Evidence
    # -----------------------------------------------------------------------

    @gl.public.write
    def add_evidence(self, case_id: str, evidence_id: str, evidence_json: str) -> str:
        assert case_id in self.cases, "Case not found"
        assert evidence_id, "evidence_id required"
        assert evidence_json, "evidence_json required"

        case = safe_loads(self.cases[case_id], {})
        caller = str(gl.message.sender_address)
        assert case.get("owner", "").lower() == caller.lower(), "Only the case owner can add evidence"
        evidence_list = case.get("evidence", [])
        assert len(evidence_list) < MAX_EVIDENCE, f"Maximum {MAX_EVIDENCE} evidence items per case"

        ev = safe_loads(evidence_json, {})
        url = clamp_str(ev.get("url", ""), 500)
        title = clamp_str(ev.get("title", ""), 200)
        evidence_record = {
            "evidence_id": evidence_id,
            "title": title,
            "evidence_type": clamp_str(ev.get("evidence_type", ""), 100),
            "url": url,
            "hash": ev.get("hash", sha256_hex(url + title)),
            "source_name": clamp_str(ev.get("source_name", ""), 200),
            "credibility_note": clamp_str(ev.get("credibility_note", ""), 400),
            "relevance_note": clamp_str(ev.get("relevance_note", ""), 600),
            "related_signal_ids": ev.get("related_signal_ids", []),
            "related_plan_ids": ev.get("related_plan_ids", []),
            "category": clamp_str(ev.get("category", "OTHER"), 60),
            "submitted_at": utcnow(),
            "submitter": caller,
        }

        evidence_list.append(evidence_record)
        case["evidence"] = evidence_list
        self.cases[case_id] = to_json(case)

        stats = safe_loads(self.stats, {})
        stats["total_evidence"] = stats.get("total_evidence", 0) + 1
        self.stats = to_json(stats)

        return to_json({"ok": True, "evidence_id": evidence_id})

    # -----------------------------------------------------------------------
    # Request Consensus — GenLayer Intelligent Evaluation
    # -----------------------------------------------------------------------

    @gl.public.write
    def request_consensus(self, case_id: str) -> str:
        assert case_id in self.cases, "Case not found"

        case_raw = self.cases[case_id]
        case = safe_loads(case_raw, {})
        caller = str(gl.message.sender_address)

        assert case.get("owner", "").lower() == caller.lower(), "Only the case owner can request consensus"
        assert case.get("status") != "UNDER_REVIEW", "Consensus already in progress"
        assert case.get("implementation_plan") is not None, "Implementation plan required before consensus"
        signals = case.get("signals", [])
        evidence_list = case.get("evidence", [])
        assert len(signals) >= 1, "At least one stakeholder signal required"
        assert len(evidence_list) >= 1, "At least one evidence item required"

        # Mark as under review
        case["status"] = "UNDER_REVIEW"
        self.cases[case_id] = to_json(case)

        # --- Build consensus prompt ---
        plan = case.get("implementation_plan", {})
        domains = case.get("domains", [])

        def fmt_list(items, key_fn):
            return "\n".join(f"- {key_fn(item)}" for item in items) if items else "None submitted."

        signals_text = fmt_list(signals, lambda s:
            f"[{s.get('stakeholder_group','')}] {s.get('title','')} | "
            f"Resistance: {s.get('resistance_level','')} | Confidence: {s.get('confidence_level','')} | "
            f"Implication: {s.get('readiness_implication','')}"
        )

        evidence_text = fmt_list(evidence_list, lambda e:
            f"[{e.get('evidence_id','')}] {e.get('title','')} — {e.get('source_name','')} | "
            f"Category: {e.get('category','')} | Relevance: {e.get('relevance_note','')}"
        )

        domains_text = fmt_list(domains, lambda d:
            f"{d.get('domain_name','')} → {d.get('self_assessed_level','')} | Notes: {d.get('notes','')}"
        )

        plan_text = (
            f"Title: {plan.get('plan_title','')}\n"
            f"Objective: {plan.get('objective','')}\n"
            f"Phases: {plan.get('delivery_phases','')}\n"
            f"Milestones: {plan.get('milestones','')}\n"
            f"Timeline: {plan.get('timeline_assumption','')}\n"
            f"Budget: {plan.get('budget_assumption','')}\n"
            f"Known Risks: {plan.get('known_risks','')}\n"
            f"Mitigation: {plan.get('mitigation_plan','')}\n"
            f"Failure Conditions: {plan.get('failure_conditions','')}"
        )

        prompt_text = (
            "You are a senior transformation readiness assessor and GenLayer AI validator.\n"
            "Your task is to evaluate whether this organisation is ready to proceed with the proposed transformation.\n\n"
            "You must assess the evidence critically, not optimistically.\n"
            "Preserve genuine uncertainty. Do not produce false confidence.\n"
            "The goal is the most defensible verdict, not the most optimistic one.\n\n"

            "## Transformation Case\n"
            f"Title: {case.get('title','')}\n"
            f"Organisation: {case.get('organisation','')}\n"
            f"Industry: {case.get('industry','')}\n"
            f"Transformation Type: {case.get('transformation_type','')}\n"
            f"Current State: {case.get('current_state','')}\n"
            f"Target State: {case.get('target_state','')}\n"
            f"Business Objective: {case.get('business_objective','')}\n"
            f"Scope: {case.get('scope','')}\n"
            f"Implementation Timeline: {case.get('implementation_timeline','')}\n"
            f"Decision Deadline: {case.get('decision_deadline','')}\n"
            f"Known Constraints: {case.get('known_constraints','')}\n"
            f"Risk Hypothesis: {case.get('risk_hypothesis','')}\n\n"

            "## Implementation Plan\n"
            f"{plan_text}\n\n"

            "## Stakeholder Signals\n"
            f"{signals_text}\n\n"

            "## Readiness Domain Self-Assessments\n"
            f"{domains_text}\n\n"

            "## Public Evidence\n"
            f"{evidence_text}\n\n"

            "## Your Assessment Task\n"
            "Evaluate whether this transformation is ready to proceed. Consider:\n"
            "1. Are the stakeholder signals credible and material?\n"
            "2. Is leadership alignment genuine or superficial?\n"
            "3. Are incentives actually aligned to the desired behaviour?\n"
            "4. Is middle-management resistance likely to block execution?\n"
            "5. Is the culture ready to absorb this transformation?\n"
            "6. Is the timeline realistic given the stated risks and dependencies?\n"
            "7. Is delivery capacity sufficient?\n"
            "8. Is the mitigation plan credible and actionable?\n"
            "9. Is the evidence quality sufficient to support this verdict?\n"
            "10. Are there material contradictions between signals and evidence?\n\n"

            "Return ONLY a valid JSON object with exactly these keys:\n"
            '{\n'
            '  "readiness_verdict": "One clear sentence verdict",\n'
            '  "verdict_label": "READY_TO_PROCEED",\n'
            '  "confidence_score": 79,\n'
            '  "implementation_risk": "HIGH",\n'
            '  "adoption_risk": "MEDIUM_HIGH",\n'
            '  "leadership_alignment": "STRONG",\n'
            '  "middle_management_alignment": "WEAK",\n'
            '  "incentive_alignment": "PARTIAL",\n'
            '  "culture_readiness": "MODERATE",\n'
            '  "delivery_capacity": "PARTIAL",\n'
            '  "timeline_realism": "WEAK",\n'
            '  "mitigation_quality": "MEDIUM",\n'
            '  "evidence_quality": "MEDIUM_HIGH",\n'
            '  "source_credibility": "MEDIUM_HIGH",\n'
            '  "contradiction_level": "MODERATE",\n'
            '  "recommended_next_action": "Specific next action",\n'
            '  "key_blockers": ["blocker 1", "blocker 2"],\n'
            '  "required_readiness_actions": ["action 1", "action 2"],\n'
            '  "short_reasoning": "2-4 sentence concise reasoning",\n'
            '  "supporting_evidence_ids": ["ev_id1"],\n'
            '  "contradictory_evidence_ids": [],\n'
            '  "follow_up_evidence_needed": ["needed item 1"]\n'
            '}\n\n'

            "verdict_label must be exactly one of: "
            "READY_TO_PROCEED, READY_AFTER_READINESS_SPRINT, CONDITIONALLY_READY, "
            "NOT_READY_REDESIGN_REQUIRED, INSUFFICIENT_EVIDENCE\n"
            "confidence_score must be an integer 0-100\n"
            "implementation_risk and adoption_risk must be one of: LOW, MEDIUM, MEDIUM_HIGH, HIGH, CRITICAL\n"
            "All alignment/readiness/capacity/realism fields must be one of: STRONG, MODERATE, PARTIAL, WEAK, ABSENT\n"
            "mitigation_quality, evidence_quality, source_credibility must be one of: HIGH, MEDIUM_HIGH, MEDIUM, LOW, INSUFFICIENT\n"
            "contradiction_level must be one of: NONE, LOW, MODERATE, HIGH, IRRECONCILABLE\n"
            "Return ONLY the JSON object. No markdown fences. No extra text."
        )

        task = (
            "Evaluate this transformation readiness case and produce a canonical, confidence-scored "
            "Transformation Readiness Verdict. Assess leadership alignment, incentive alignment, "
            "stakeholder resistance, culture readiness, delivery capacity, timeline realism, "
            "mitigation quality, and evidence quality. Return a structured JSON verdict."
        )

        criteria = (
            "The output must be a valid JSON object with all required keys. "
            "verdict_label must be one of: READY_TO_PROCEED, READY_AFTER_READINESS_SPRINT, "
            "CONDITIONALLY_READY, NOT_READY_REDESIGN_REQUIRED, INSUFFICIENT_EVIDENCE. "
            "confidence_score must be an integer between 0 and 100. "
            "All risk levels must be LOW, MEDIUM, MEDIUM_HIGH, HIGH, or CRITICAL. "
            "All alignment levels must be STRONG, MODERATE, PARTIAL, WEAK, or ABSENT. "
            "Quality levels must be HIGH, MEDIUM_HIGH, MEDIUM, LOW, or INSUFFICIENT. "
            "key_blockers and required_readiness_actions must be non-empty arrays when risks exist. "
            "short_reasoning must be 2-4 sentences, not a single word. "
            "The verdict must be defensible and preserve genuine uncertainty."
        )

        def nondet_assess() -> str:
            return prompt_text

        result_raw = gl.eq_principle.prompt_non_comparative(
            nondet_assess,
            task=task,
            criteria=criteria,
        )

        verdict = safe_loads(
            result_raw.strip() if isinstance(result_raw, str) else str(result_raw),
            None
        )

        if not verdict or not isinstance(verdict, dict):
            verdict = {
                "readiness_verdict": "Unable to produce a verdict — insufficient information or parse error.",
                "verdict_label": "INSUFFICIENT_EVIDENCE",
                "confidence_score": 0,
                "implementation_risk": "HIGH",
                "adoption_risk": "HIGH",
                "leadership_alignment": "ABSENT",
                "middle_management_alignment": "ABSENT",
                "incentive_alignment": "ABSENT",
                "culture_readiness": "ABSENT",
                "delivery_capacity": "ABSENT",
                "timeline_realism": "ABSENT",
                "mitigation_quality": "INSUFFICIENT",
                "evidence_quality": "INSUFFICIENT",
                "source_credibility": "INSUFFICIENT",
                "contradiction_level": "NONE",
                "recommended_next_action": "Re-submit with more complete evidence and stakeholder signals.",
                "key_blockers": ["Verdict parse error — validator output was malformed."],
                "required_readiness_actions": ["Retry consensus with additional evidence."],
                "short_reasoning": "The consensus process did not return a parseable verdict. This may indicate insufficient evidence or a transient network issue. Re-submitting with additional signals and evidence is recommended.",
                "supporting_evidence_ids": [],
                "contradictory_evidence_ids": [],
                "follow_up_evidence_needed": ["Complete evidence package required."],
            }

        # Validate and sanitise critical fields
        if verdict.get("verdict_label") not in ALLOWED_VERDICT_LABELS:
            verdict["verdict_label"] = "INSUFFICIENT_EVIDENCE"
        if verdict.get("implementation_risk") not in ALLOWED_RISK_LEVELS:
            verdict["implementation_risk"] = "HIGH"
        if verdict.get("adoption_risk") not in ALLOWED_RISK_LEVELS:
            verdict["adoption_risk"] = "HIGH"
        for field in ["leadership_alignment", "middle_management_alignment", "incentive_alignment",
                       "culture_readiness", "delivery_capacity", "timeline_realism"]:
            if verdict.get(field) not in ALLOWED_ALIGNMENT_LEVELS:
                verdict[field] = "ABSENT"
        for field in ["mitigation_quality", "evidence_quality", "source_credibility"]:
            if verdict.get(field) not in ALLOWED_QUALITY_LEVELS:
                verdict[field] = "INSUFFICIENT"
        if verdict.get("contradiction_level") not in ALLOWED_CONTRADICTION_LEVELS:
            verdict["contradiction_level"] = "NONE"
        if not isinstance(verdict.get("confidence_score"), int):
            try:
                verdict["confidence_score"] = int(verdict.get("confidence_score", 0))
            except Exception:
                verdict["confidence_score"] = 0
        verdict["confidence_score"] = max(0, min(100, verdict["confidence_score"]))
        if not isinstance(verdict.get("key_blockers"), list):
            verdict["key_blockers"] = []
        if not isinstance(verdict.get("required_readiness_actions"), list):
            verdict["required_readiness_actions"] = []
        if not isinstance(verdict.get("supporting_evidence_ids"), list):
            verdict["supporting_evidence_ids"] = []
        if not isinstance(verdict.get("contradictory_evidence_ids"), list):
            verdict["contradictory_evidence_ids"] = []
        if not isinstance(verdict.get("follow_up_evidence_needed"), list):
            verdict["follow_up_evidence_needed"] = []

        # Assign round number and metadata
        existing_verdicts = case.get("verdicts", [])
        verdict["round"] = len(existing_verdicts) + 1
        verdict["verdict_at"] = utcnow()
        verdict["triggered_by"] = caller

        existing_verdicts.append(verdict)
        case["verdicts"] = existing_verdicts
        case["status"] = "VERDICT_ISSUED"
        self.cases[case_id] = to_json(case)

        stats = safe_loads(self.stats, {})
        stats["total_verdicts"] = stats.get("total_verdicts", 0) + 1
        self.stats = to_json(stats)

        return to_json({"ok": True, "case_id": case_id, "verdict": verdict})

    # -----------------------------------------------------------------------
    # Read Methods
    # -----------------------------------------------------------------------

    @gl.public.view
    def get_case(self, case_id: str) -> str:
        return self.cases.get(case_id, to_json({"error": "not found"}))

    @gl.public.view
    def get_all_case_ids(self) -> str:
        return self.case_ids

    @gl.public.view
    def get_owner_cases(self, owner_address: str) -> str:
        return self.owner_cases.get(owner_address, "[]")

    @gl.public.view
    def get_protocol_stats(self) -> str:
        return self.stats
