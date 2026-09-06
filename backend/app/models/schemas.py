from pydantic import BaseModel, Field


class JobRequirement(BaseModel):
    job_title: str = Field(
        ...,
        min_length=2
    )

    required_keywords: list[str] = Field(
        default_factory=list
    )

    preferred_keywords: list[str] = Field(
        default_factory=list
    )

    education: list[str] = Field(
        default_factory=list
    )

    experience_min: int = Field(
        default=0,
        ge=0
    )

    experience_max: int | None = Field(
        default=None,
        ge=0
    )


class JobMatchRequest(BaseModel):

    resume_text: str = Field(
        ...,
        min_length=10
    )

    job: JobRequirement