# GULP tasks migrated to webpack

##
- main task: ```gulp jenkins```
- new tasks ```npm run jenkins``` and ```npm run jenkins-dev```


## gulp styles

$dest: '../Source/B2C.Honda.Automobiles.Web/Areas/Honda_Automobiles/'

### Styles: ```gulp styles```
* './src/styles/sass/vehicles/*.scss' to be generated as *.min.css files on $dest/css/
Note: This task should run on dev only to generate the VLPs custom styles that are loaded by hand via CMS under the Vehicle Batch component. This task it's still on gulp.
* './src/styles/sass/main.css.scss' to be generated as styles.min.css on $dest/css/


** gulp styles-vendor
* './src/styles/vendor/*.css' to be generated as vendor.min.css on $dest/css/ NO SOURCE MAP
Note: vendor.min.js it's being replaced on ```gulp jenkins``` check TODO section

** gulp styles-tools
* './src/styles/sass/tools/skins/*.scss' to be generated as tools-*.min.css files on $dest/css/


# TODO LIST
- Migrate VLPs css generation to webpack, current task: ```gulp styles-static```
- Use webpack vendor entry to generate final vendor.min.js
