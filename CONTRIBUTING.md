# Contributing

When contributing to this repository, please first discuss the change you wish to make via issue,
email, or any other method with the owners of this repository before making a change. 

## Pull Request Process

For new features or bug fixes, please follow the below guideline, making sure that the pull request is coming from a feature branch. This guarantees that new features are merged with `develop` during a pull request. 

1. Create a feature branch: `git flow feature start module_1`
2. The code is updated on the feature branch
3. When the feature is completed a pull request is opened in GitHub comparing develop and the feature branch `module_1`
4. The team reviews the pull request and makes comments
5. Any changes from the pull request are made to the feature branch
6. Once all changes are incorporated on the feature branch the feature branch is finished: `git flow feature finish module_1`
7. The `develop` branch is pushed to GitHub (GitHub will automatically mark the pull request as closed/merged when this happens)
