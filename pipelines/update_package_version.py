import json
import os

def update_version():
    REASON = os.getenv("REASON")
    VERSION = os.getenv("VERSION")
    BRANCH = os.getenv("BRANCH")

    # Get the parent directory of the script
    script_dir = os.path.dirname(os.path.abspath(__file__))
    package_json_path = os.path.join(script_dir, "..", "package.json")

    isPreRelease = True
    canRelease = False

    if REASON == "PullRequest":
        isPreRelease = True
        canRelease = False
    elif VERSION == "":
        raise ValueError("VERSION is not provided.")
    elif BRANCH == "refs/heads/develop":
        # Verify that VERSION is a valid semantic package version with a minor value that is odd.
        if int(VERSION.split(".")[1]) % 2 == 0:
            raise ValueError("VERSION is not a valid semantic package version for develop branch.")
        isPreRelease = True
        canRelease = True
    elif BRANCH == "refs/heads/master":
        # Verify that VERSION is a valid semantic package version with a minor value that is even.
        if int(VERSION.split(".")[1]) % 2 != 0:
            raise ValueError("VERSION is not a valid semantic package version for master branch.")
        isPreRelease = False
        canRelease = True
    else:
        isPreRelease = True
        canRelease = False
    
    with open(package_json_path, "r") as f:
        data = json.load(f)
        data["version"] = VERSION

    with open(package_json_path, "w") as f:
        json.dump(data, f, indent=2)

    print(f"##vso[task.setvariable variable=isPreRelease]{isPreRelease}")
    print(f"##vso[task.setvariable variable=canRelease]{canRelease}")

if __name__ == "__main__":
    update_version()