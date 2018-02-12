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

  let dirSpinner = ora("Scaffolding..").start();
  try {
    await scaffoldArray.map(async (fileO, index, array) => {
      await fs.outputFile(`${dir}/${fileO.file}`, fileO.content);
    });

    dirSpinner.succeed("Scaffolding was successful!");
  } catch (error) {
    dirSpinner.fail(error.toString());
  }

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

  // save all icons
  let iconSpinner = ora("Downloading Icons...").start();
  try {
    await Promise.all(
      sizes.map(size => {
        download(`${ROOT}/${suffix}/${size}.svg`).then(buffer => {
          return fs.outputFile(
            `${dir}/data/images/icons/${size}/${json.rdnn}.svg`,
            buffer
          );
        });
      })
    );

    iconSpinner.succeed("Downloading Icons was successful!");
  } catch (error) {
    iconSpinner.fail(error.toString());
  }
}

module.exports = scaffold;
