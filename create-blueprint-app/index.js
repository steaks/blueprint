#!/usr/bin/env node

const { program } = require('commander');
const axios = require('axios');
const fs = require('fs');
const tar = require('tar');
const { exec } = require('child_process');
const ora = require('ora');

const templates = ["gettingStarted", "skeleton", "helloWorld", "userProfile", "rectangle"];

program
  .option('-n, --name <name>', 'name of the app')
  .option('-t, --template <type>', 'specify a template', 'skeleton')
  .arguments('[name]')
  .action((name) => {
    program.name = name;
  });

program.parse(process.argv);

const options = program.opts();
const appName = program.name || options.name;
const template = options.template;

if (!appName) {
  console.error('Provide a name for your app');
  process.exit(1);
}

if (!templates.includes(template)) {
  console.error('Invalid template. The template options are gettingStarted, skeleton, helloWorld, userProfile, rectangle.');
  process.exit(1);
}

if (appName === '{your-app-name}') {
  console.error('Provide a valid name for your app');
  process.exit(1);
}

const url = `https://raw.githubusercontent.com/steaks/blueprint-templates/main/${template}-blueprint.tar.gz`;
const tarballPath = `${template}-blueprint.tar.gz`;

const spinner = ora('Downloading and setting up the project...').start();

const execute = async () => {
  const response = await axios({url, method: 'GET', responseType: 'stream'});
  new Promise((resolve, reject) => {
    const writer = fs.createWriteStream(tarballPath);

    response.data.pipe(writer);

    writer.on('finish', async () => {
      await tar.x({file: tarballPath});
      fs.renameSync(template, appName);
      fs.unlinkSync(tarballPath);

      spinner.text = 'Running make install and make build...';

      // Change to the project directory and run `make install` and `make build`
      exec(`cd ${appName} && make install && make build`, (error, stdout, stderr) => {
        spinner.stop();
        if (error) {
          console.error(`Error running make install/build: ${error.message}`);
          reject();
        }
        if (stderr) {
          reject();
          console.error(`Error output: ${stderr}`);
        }
        console.log(`Project setup completed. Navigate to ${appName} and start working on your project.`);
        resolve();
      });
    });

    writer.on('error', (err) => {
      spinner.stop();
      console.error('Error writing file:', err);
      reject();
    });
  });
};

execute().catch(() => process.exit(1));