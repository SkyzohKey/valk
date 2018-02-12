const fs = require("fs-extra");
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
      file: `data/${json.rdnn}.desktop`,
      content: gen.genDesktop(json)
    }
  ];

  scaffoldArray.map(async (fileO, index, array) => {
    await fs.outputFile(`${dir}/${fileO.file}`, fileO.content);
  });
}

module.exports = scaffold;
