.PHONY: build development

development:
	ENV=development make build

build: build/css/styles.min.css build/js/app.min.js build/index.html build/favicon.ico build/emails/*.html

build/js:
	mkdir -p build/js

build/js/app.js: package.json build/js web/js/*.js web/js/**/*.js
	./node_modules/browserify/bin/cmd.js web/js/app.js -o $@

build/js/app.min.js: build/js/app.js
ifeq "${ENV}" "development"
	cp build/js/app.js $@
else
	./node_modules/uglifyjs/bin/uglifyjs build/js/app.js -o $@
endif

build/css:
	mkdir -p build/css

build/css/styles.css: web/scss/*.scss build/fonts
	./node_modules/node-sass/bin/node-sass web/scss/styles.scss $@

build/fonts: node_modules/material-design-icons/iconfont/MaterialIcons-Regular.*
	mkdir -p build/fonts
	cp node_modules/material-design-icons/iconfont/MaterialIcons-Regular.* build/fonts/

build/css/styles.min.css: build/css build/css/styles.css
ifeq ($(ENV),development)
	cp build/css/styles.css $@
else
	./node_modules/uglifycss/uglifycss build/css/styles.css > $@
endif

build/index.html: web/*.html web/includes/*.html util/build-views.js build/img
	mkdir -p build/view/directive
	node util/build-views.js -s ./web -t ./build

build/img: web/img/*.* web/img/**/*.*
	mkdir -p build/img
	cp -r web/img/* build/img/

build/favicon.ico: build/img
	cp web/img/favicon/favicon.ico build/favicon.ico

# Emails

build/emails/*.html: emails/*.*
	mkdir -p build/emails
	node util/build-views.js -s ./emails -t ./build/emails
	cp emails/*.png build/emails
