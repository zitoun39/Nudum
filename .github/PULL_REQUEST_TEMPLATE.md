## Description

Provide a detailed summary of the changes introduced by this pull request.

## Related Issues

Closes #[issue_number]

## Type of Change

- [ ] Bug fix (non-breaking change which fixes an issue)
- [ ] New feature (non-breaking change which adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to change)
- [ ] Documentation update

## Verification Checklist

- [ ] I have read the ubiquitous language rules in `AGENTS.md` and `docs/03-domain/ubiquitous-language.md` and verify no synonyms were used.
- [ ] I have verified that pnpm installs, workspace builds, and lint checks pass cleanly.
- [ ] I have run local integration/unit tests and verify they pass.
- [ ] My database operations strictly adhere to ADR-0014 transaction boundaries and `SET LOCAL search_path` constraints.
- [ ] No circular dependencies are introduced.
- [ ] I have updated corresponding documentation or ADRs if my code changes design rules.
