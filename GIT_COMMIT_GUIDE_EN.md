# Git Commit Guide (EN)

A commit is a snapshot of your changes. Standard flow:
1. Check status
2. Stage files
3. Commit with a clear message
4. Push to remote

## Step by Step
1. Go to your project folder
```bash
cd /Users/sinemunch/Documents/GitHub/VideoPortfolio
```

2. Check what changed
```bash
git status
```

3. Stage files
```bash
git add .
```
Or stage one file:
```bash
git add src/components/ProjectOverlay.astro
```

4. Commit without opening an editor (recommended)
```bash
git commit -m "Describe your change"
```
Example:
```bash
git commit -m "Fix portrait overlay alignment"
```

5. Push to GitHub
```bash
git push
```

6. Confirm sync
```bash
git status
```
Expected output:
```text
Your branch is up to date with 'origin/main'.
nothing to commit, working tree clean
```

## Amend Last Commit
Change the latest commit message without opening an editor:
```bash
git commit --amend -m "New commit message"
```
If that commit was already pushed:
```bash
git push --force-with-lease
```

## Common Errors
1. nothing to commit
- You did not stage changes. Run `git status` and then `git add ...`.

2. problem with editor 'vi'
- Commit with `-m`:
```bash
git commit -m "Your message"
```

3. push rejected
- Pull latest changes first:
```bash
git pull --rebase
```
- Then push again:
```bash
git push
```

## Quick Copy/Paste
```bash
git status
git add .
git commit -m "Your message"
git push
git status
```
