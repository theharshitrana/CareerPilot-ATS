import re


SKILLS = {
    "Python": [r"\bpython\b"],
    "Java": [r"\bjava\b"],
    "C": [r"\bc\b"],
    "C++": [r"\bc\+\+\b", r"\bcpp\b"],
    "C#": [r"\bc#\b", r"\bc sharp\b"],
    "SQL": [r"\bsql\b"],
    "MySQL": [r"\bmysql\b"],
    "PostgreSQL": [r"\bpostgresql\b", r"\bpostgres\b"],
    "MongoDB": [r"\bmongodb\b", r"\bmongo\b"],
    "JavaScript": [r"\bjavascript\b", r"\bjs\b"],
    "TypeScript": [r"\btypescript\b", r"\bts\b"],
    "React": [r"\breact\b", r"\breact\.js\b", r"\breactjs\b"],
    "Node.js": [r"\bnode\.js\b", r"\bnodejs\b"],
    "FastAPI": [r"\bfastapi\b"],
    "Flask": [r"\bflask\b"],
    "Django": [r"\bdjango\b"],
    "Git": [r"\bgit\b"],
    "GitHub": [r"\bgithub\b"],
    "Docker": [r"\bdocker\b"],
    "Kubernetes": [r"\bkubernetes\b"],
    "AWS": [r"\baws\b", r"\bamazon web services\b"],
    "Google Cloud": [r"\bgcp\b", r"\bgoogle cloud\b"],
    "Microsoft Azure": [r"\bazure\b", r"\bmicrosoft azure\b"],
    "Machine Learning": [
        r"\bmachine learning\b",
        r"\bmachine-learning\b",
        r"\bml\b"
    ],
    "Deep Learning": [
        r"\bdeep learning\b",
        r"\bdeep-learning\b"
    ],
    "Artificial Intelligence": [
        r"\bartificial intelligence\b",
        r"\bai\b"
    ],
    "Natural Language Processing": [
        r"\bnatural language processing\b",
        r"\bnlp\b"
    ],
    "Computer Vision": [
        r"\bcomputer vision\b",
        r"\bcv\b"
    ],
    "TensorFlow": [r"\btensorflow\b"],
    "PyTorch": [r"\bpytorch\b"],
    "Scikit-learn": [
        r"\bscikit-learn\b",
        r"\bsklearn\b"
    ],
    "Data Structures": [
        r"\bdata structures\b",
        r"\bdata structure\b"
    ],
    "Algorithms": [
        r"\balgorithms\b",
        r"\balgorithm\b"
    ],
    "REST API": [
        r"\brest api\b",
        r"\brest apis\b",
        r"\brestful api\b",
        r"\brestful apis\b",
        r"\brest-api\b",
        r"\brest-apis\b"
    ],
    "HTML": [r"\bhtml\b"],
    "CSS": [r"\bcss\b"],
    "Communication": [r"\bcommunication skills?\b"],
    "Leadership": [r"\bleadership\b"],
    "Problem Solving": [
        r"\bproblem solving\b",
        r"\bproblem-solving\b"
    ],
    "Teamwork": [
        r"\bteamwork\b",
        r"\bteam work\b"
    ]
}


def extract_skills(text: str) -> list[str]:
    text_lower = text.lower()
    detected = []

    for skill, patterns in SKILLS.items():
        for pattern in patterns:
            if re.search(pattern, text_lower):
                detected.append(skill)
                break

    return sorted(detected)


def extract_skill_details(text: str) -> dict:
    skills = extract_skills(text)

    return {
        "skills_detected": skills,
        "skill_count": len(skills)
    }
