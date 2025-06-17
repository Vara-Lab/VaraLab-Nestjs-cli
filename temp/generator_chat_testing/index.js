#!/usr/bin/env node

const { Command } = require('commander');
const degit = require('degit');
const inquirer = require('inquirer');
const fs = require('fs-extra');
const mustache = require('mustache');
const path = require('path');

const program = new Command();

program
  .name('template-cli')
  .description('Genera un nuevo proyecto desde un template remoto o local')
  .argument('<template>', 'Repositorio de GitHub o ruta local (formato user/repo o ./ruta)')
  .argument('[destination]', 'Carpeta de destino', 'my-app')
  .action(async (template, destination) => {
    try {
      console.log('COmenzando degit con:', template);
      const emitter = degit(template, { cache: false, force: true });
      console.log('Se termino del degit')
      await x.clone(destination);
      console.log('Se termino el emitter')

      fs.copy(template, destination);

      const x = inquirer.createPromptModule([
        { name: 'projectName', message: 'Nombre del proyecto:' },
        { name: 'author', message: 'Autor del proyecto:' }
      ])

      const answers = await inquirer.prompt([
        { name: 'projectName', message: 'Nombre del proyecto:' },
        { name: 'author', message: 'Autor del proyecto:' }
      ]);

      const replaceInPath = (inputPath) => {
        return inputPath.replace(/{{(.*?)}}/g, (_, key) => answers[key.trim()] || '');
      };

      const processDirectory = async (dir) => {
        const items = await fs.readdir(dir);
        for (const item of items) {
          const itemPath = path.join(dir, item);
          const stat = await fs.stat(itemPath);

          const newItemName = replaceInPath(item);
          const newItemPath = path.join(dir, newItemName);

          if (itemPath !== newItemPath) {
            await fs.move(itemPath, newItemPath);
          }

          if (stat.isDirectory()) {
            await processDirectory(newItemPath);
          } else if (stat.isFile()) {
            const content = await fs.readFile(newItemPath, 'utf-8');
            const output = mustache.render(content, answers);
            await fs.writeFile(newItemPath, output);
          }
        }
      };

      await processDirectory(destination);

      console.log('✅ Proyecto generado con éxito en', destination);
    } catch (err) {
      console.error('❌ Error:', err.message);
    }
  });

program.parse();
