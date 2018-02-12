const fs = require("fs-extra");
const download = require("download");
const ora = require("ora");
const gen = require("./generators");

async function scaffold(dir, json) {
  const scaffoldArray = [
    // Files
    {
      file: "meson.build",
      content: gen.genRootMeson(json)
    },
    {
      file: ".gitignore",
      content: gen.genGitIgnore()
    },
    {
      file: "post_install.py",
      content: gen.genPostInstallScript()
    },
    {
      file: ".travis.yml",
      content: gen.genTravis()
    },
    {
      file: "src/meson.build",
      content: gen.genSrcMeson()
    },
    {
      file: "data/meson.build",
      content: gen.genDataMeson()
    },
    {
      file: `data/${json.rdnn}.appdata.xml`,
      content: gen.genAppData(json)
    },
    {
      file: `data/${json.rdnn}.gschema.xml`,
      content: gen.genGSchema(json)
    },
    {
      file: `data/${json.rdnn}.gresource.xml`,
      content: gen.genGResource(json)
    },
    {
      file: "data/css/style.css",
      content: gen.genCss()
    },
    {
      file: `data/${json.rdnn}.desktop`,
      content: gen.genDesktop(json)
    }
  ];

  // the awesome icon templates from TraumaD
  const ROOT =
    "https://github.com/TraumaD/elementary-icon-templates/raw/master/Icons";
  const sizes = ["16", "24", "32", "48", "64", "128"];

  let suffix;
  // download icons.
  switch (json.icon) {
    case "circle":
      suffix = "Circle%20Icon";
      break;

    case "rectangle-H":
      suffix = "Rectangle-H%20Icon";
      break;

    case "rectangle-V":
      suffix = "Rectangle-V%20Icon";
      break;

    case "square":
      suffix = "Square%20Icon";
      break;

    default:
      suffix = "Square%20Icon";
      break;
  }

  try {
    await Promise.all(
      await Promise.all(
        scaffoldArray.map(async (fileO, index, array) => {
          let dirSpinner = ora(`Scaffolding.. : ${fileO.file}`).start();

          try {
            await fs.outputFile(`${dir}/${fileO.file}`, fileO.content);

            dirSpinner.succeed(`Scaffolding ${fileO.file} successful!`);
          } catch (error) {
            dirSpinner.fail();
          }
        })
      ),
      // download icons
      sizes.map(async size => {
        let iconSpinner = ora(
          `Downloading Icon ${json.icon} ${size}...`
        ).start();

        try {
          let buffer = await download(`${ROOT}/${suffix}/${size}.svg`);
          await fs.outputFile(
            `${dir}/data/images/icons/${size}/${json.rdnn}.svg`,
            buffer
          );

          iconSpinner.succeed(`Icon ${size}: downloaded!`);
        } catch (error) {
          iconSpinner.fail();
        }
      })
    );
  } catch (error) {
    await cleanup(dir);
  }
}

async function cleanup(dir) {
  await fs.rmdir(dir);
}
module.exports = scaffold;
