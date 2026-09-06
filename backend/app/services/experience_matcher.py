from app.services.experience_extractor import calculate_total_experience


def match_experience(resume_text: str, minimum_years: int = 0, maximum_years: int | None = None):
    experience = calculate_total_experience(resume_text)

    candidate_years = experience["total_years"]

    if candidate_years >= minimum_years:
        minimum_requirement_met = True
    else:
        minimum_requirement_met = False

    if maximum_years is None:
        maximum_requirement_met = True
    else:
        maximum_requirement_met = candidate_years <= maximum_years

    if minimum_requirement_met and maximum_requirement_met:
        score = 100.0
    elif minimum_years > 0:
        score = round(
            min(candidate_years / minimum_years, 1.0) * 100,
            2
        )
    else:
        score = 100.0

    return {
        "candidate_experience_years": candidate_years,
        "candidate_experience_months": experience["total_months"],
        "minimum_years": minimum_years,
        "maximum_years": maximum_years,
        "minimum_requirement_met": minimum_requirement_met,
        "maximum_requirement_met": maximum_requirement_met,
        "score": score,
        "periods": experience["periods"]
    }
