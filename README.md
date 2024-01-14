# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh


wt -d "c:\myprojects\my-elk" -p "fe" cmd /k npm run dev ; split-pane -d "c:\myprojects\my-elk" cmd /k npm run be

 npx npm-check-updates -u


# AWS setup
https://medium.com/codemonday/github-actions-for-ci-cd-with-ec2-codedeploy-and-s3-e93e75bf1ce0
In github: In our repository click Settings add our IAM key that we create above
files: 
  ./ecosystem.config.js
  ./appspec.yml  // aws codedeploy requires this filename its fixed and located in root of the project
  ./scripts/reload-pm2.sh
  ./.github/workflows/ci-cd.yml