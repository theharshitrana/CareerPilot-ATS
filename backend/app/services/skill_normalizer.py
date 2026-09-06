SKILL_ALIASES = {
    "js": "javascript",
    "javascript": "javascript",

    "ts": "typescript",
    "typescript": "typescript",

    "react.js": "react",
    "reactjs": "react",
    "react": "react",

    "node.js": "node",
    "nodejs": "node",
    "node": "node",

    "postgres": "postgresql",
    "postgresql": "postgresql",

    "mongo": "mongodb",
    "mongodb": "mongodb",

    "ml": "machine learning",
    "machine-learning": "machine learning",
    "machine learning": "machine learning",

    "ai": "artificial intelligence",
    "artificial intelligence": "artificial intelligence",

    "nlp": "natural language processing",
    "natural language processing": "natural language processing",

    "aws": "amazon web services",
    "amazon web services": "amazon web services",

    "gcp": "google cloud",
    "google cloud": "google cloud",

    "rest": "rest api",
    "rest api": "rest api",
    "restful api": "rest api",

    "dsa": "data structures and algorithms",
    "data structures and algorithms": "data structures and algorithms",

    "sql": "sql",
    "python": "python",
    "java": "java",
    "c++": "c++",
    "c#": "c#"
}


def normalize_skill(skill: str) -> str:
    cleaned = skill.lower().strip()
    return SKILL_ALIASES.get(cleaned, cleaned)


def normalize_skills(skills: list[str]) -> list[str]:
    normalized = set()

    for skill in skills:
        normalized.add(normalize_skill(skill))

    return sorted(normalized)
