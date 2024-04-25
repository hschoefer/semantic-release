// semantic-release variables are documented at:
//  https://semantic-release.gitbook.io/semantic-release/developer-guide/js-api#result

module.exports = {
    "branches": [process.env.BRANCH_NAME_PLAIN], // Allow to calculate version on all branches.
    "plugins": [
        [
            "@semantic-release/commit-analyzer",
            {
                "preset": "angular",
                "releaseRules": [
                    { "type": "chore", "scope": "deps", "release": "patch" }
                ]
            }
        ],
        "@semantic-release/release-notes-generator",
        ["@semantic-release/exec", {
                "generateNotesCmd": `echo "\${nextRelease.version}" > ${process.env.WORKING_DIRECTORY}/version.txt;echo "\${lastRelease.version}${process.env.VERSION_CONNECTOR}\${commits.length}${process.env.BRANCH_NAME_PROCESSED}" > ${process.env.WORKING_DIRECTORY}/dev-version.txt;`
            }],
        "@semantic-release/changelog",
        ["@semantic-release/git", {
            "assets": process.env.ASSETS.split(",")
        }]
    ]
}