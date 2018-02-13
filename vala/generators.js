const genGitIgnore = () => {
  return `
  build/*
  `;
};

const genPostInstallScript = () => {
  return `
  #!/usr/bin/env python3
  
  import os
  import subprocess
  
  schemadir = os.path.join(os.environ['MESON_INSTALL_PREFIX'], 'share', 'glib-2.0', 'schemas')
  
  if not os.environ.get('DESTDIR'):
      print('Compiling gsettings schemas...')
      subprocess.call(['glib-compile-schemas', schemadir], shell=False)
  `;
};

const genRootMeson = ({ rdnn, version, license }) => {
  let proj = `
project('${rdnn}', ['vala', 'c'],
    version : '${version}',
    license: '${license}'
)
          `;

  let res = `
gnome = import('gnome')
i18n = import('i18n')

gresource = gnome.compile_resources(
    'as-resources', 'data/${rdnn}.gresource.xml',
    source_dir: 'data',
    c_name: 'as'
)

conf = configuration_data()
conf.set_quoted('GETTEXT_PACKAGE', meson.project_name())
configure_file(output: 'config.h', configuration: conf)
config_h_dir = include_directories('.')

c_args = [
'-include', 'config.h',
'-DGWEATHER_I_KNOW_THIS_IS_UNSTABLE',
]
          `;

  let dirs = ["data", "po", "src"];

  let subdirs = `
${dirs
    .map(dir => {
      return `subdir(${dir})`;
    })
    .join("\n")}
          `;

  let dependencies = ["granite", "gobject-2.0", "gtk+-3.0", "glib-2.0"];
  let exec = `
executable('${rdnn}',
    sources,
    gresource,
    c_args: c_args,
    dependencies :[
    ${dependencies
      .map(dependency => {
        return `dependency("${dependency}")`;
      })
      .join(",\n    ")}
    ],
    install : true
)

meson.add_install_script('post_install.py')
          `;

  return `
${proj}
${res}
${subdirs}
${exec}
    `;
};

// src
const genSrcMeson = () => {
  return `
  sources = files()
  `;
};

// data
const genAppData = ({ author, name, rdnn, license, email }) => {
  return `
<?xml version="1.0" encoding="UTF-8"?>
<!-- Copyright ${new Date().getFullYear()} ${author} <${email}> -->
<component type="desktop-application">
    <id>${rdnn}.desktop</id>
    <metadata_license>CC0-1.0</metadata_license>
    <project_license>${license}</project_license>
    <name>${name}</name>
    <summary></summary>
    <developer_name>${author}</developer_name>
    <provides>
        <binary>${rdnn}</binary>
    </provides>
    <description>
    </description>   
    <update_contact>${email}</update_contact>
    <custom>
    </custom>
    <screenshots>
        <screenshot type="default">
        </screenshot>
    </screenshots>
</component>
  `;
};

const genDesktop = ({ rdnn, name }) => {
  return `
[Desktop Entry]
Name=${name}
Comment=Template for vala apps
Icon=${rdnn}
Exec=${rdnn}
Terminal=false
Type=Application
StartupNotify=true
Categories=GNOME;GTK;IDE;Utility;
Keywords=app;template;vala;
  `;
};

const genGSchema = ({ rdnn }) => {
  return `
<?xml version="1.0" encoding="UTF-8"?>
<schemalist>

  <schema id="${rdnn}" path="/${rdnn.split(".").join("/")}/">
    
  </schema>

</schemalist>  
  `;
};

const genGResource = ({ rdnn }) => {
  return `
<?xml version="1.0" encoding="UTF-8"?>
<gresources>

  <gresource prefix="/${rdnn.split(".").join("/")}/css">
    <file alias="style.css" compressed="true">css/style.css</file>
  </gresource>

  <gresource prefix="/${rdnn.split(".").join("/")}/images">
    <file alias="${rdnn}.svg" compressed="true" preprocess="xml-stripblanks">images/${rdnn}.svg</file>

    <file alias="16-${rdnn}.svg" compressed="true" preprocess="xml-stripblanks">images/icons/16/${rdnn}.svg</file>

    <file alias="24-${rdnn}.svg" compressed="true" preprocess="xml-stripblanks">images/icons/24/${rdnn}.svg</file>

    <file alias="32-${rdnn}.svg" compressed="true" preprocess="xml-stripblanks">images/icons/32/${rdnn}.svg</file>

    <file alias="48-${rdnn}.svg" compressed="true" preprocess="xml-stripblanks">images/icons/48/${rdnn}.svg</file>
  
    <file alias="64-${rdnn}.svg" compressed="true" preprocess="xml-stripblanks">images/icons/64/${rdnn}.svg</file>
  
    <file alias="128-${rdnn}.svg" compressed="true" preprocess="xml-stripblanks">images/icons/128/${rdnn}.svg</file>
  </gresource>
  
</gresources>
  `;
};

const genDataMeson = () => {
  return `
icon_sizes = ['16','24','32', '48', '64', '128']

foreach i : icon_sizes
    install_data(
        join_paths('images', 'icons', i, meson.project_name() + '.svg'),
        install_dir: join_paths(get_option('datadir'), 'icons', 'hicolor', i + 'x' + i, 'apps')
    )
endforeach

install_data(
    join_paths('images', meson.project_name() + '.svg'),
    install_dir: join_paths(get_option('datadir'), 'template-for-vala-apps', 'images')
)

install_data(
    join_paths('images', meson.project_name() + '.png'),
    install_dir: join_paths(get_option('datadir'), 'pixmaps')
)

install_data(
    meson.project_name() + '.desktop',
    install_dir: join_paths(get_option('datadir'), 'applications')
)

install_data(
    meson.project_name() + '.appdata.xml',
    install_dir: join_paths(get_option('datadir'), 'metainfo')
)

install_data(
    meson.project_name() + '.gschema.xml',
    install_dir: join_paths(get_option('datadir'), 'glib-2.0', 'schemas')
)
  `;
};

const genCss = () => {
  return `
@define-color colorPrimary #546A79;
@define-color textColorPrimary #ECF0F1;
  `;
};

const genTravis = () => {
  return `
sudo: required
language: generic

services:
- docker

script:
- wget -O- https://raw.githubusercontent.com/harisvsulaiman/element-build/master/script.sh | sh -

branches:
except:
    - /^debian\/\d/
  `;
};

module.exports = {
  genRootMeson,
  genGitIgnore,
  genPostInstallScript,
  genSrcMeson,
  genDataMeson,
  genAppData,
  genGSchema,
  genGResource,
  genDesktop,
  genCss,
  genTravis
};
