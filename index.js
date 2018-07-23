const fs   		 = require('fs');
const path   	 = require('path');
let modules 	 = {};

process.env.FWD  = path.normalize(__dirname+"/../../");

Object.defineProperty(String.prototype, "class", {
	enumerable   : false,
	configurable : false,
	get          : function(){

		let context   = this.valueOf().split('::');
		let namespace = context.pop();
			context   = context.shift() || "FWD";
		let filename  = namespace.split('/').pop();

		if (modules[context + '::' + filename]){
			return modules[context + '::' + filename];
		}

		let pathname  = path.normalize(process.env[context] + '/' + namespace);

		// /Users/Florent/Documents/labs.local/www/Combo/Catalyst/Core/Kernel/Patterns/Daemon.js
		// /Users/Florent/Documents/labs.local/www/Combo/Catalyst/Core/Kernel/Patterns/Deamon
		console.log( fs.existsSync(pathname + '.js'), pathname + '.js' )

		if (fs.existsSync(pathname + '.js')
		||  fs.existsSync(pathname + '.json')){
			try {
				let classLoad = require(pathname);
				if (classLoad.name && classLoad.name === filename){
					return modules[context + '::' + filename] = classLoad;
				}	return classLoad;
			} catch(e) {
				let className = /ReferenceError:(.*) is/gi.exec(e.stack);
				if (className){
					console.log(className,Object.keys(modules));
					let paths 	  = Object.keys(modules).filter( v => RegExp(className+'$').test(v) );
					console.log(paths);
					console.log(modules);
				} else {
					console.log(e.stack);
				}
			}
		}else{
			console.log('else',pathname);
		}

		console.log(context + '::' + namespace);
		return context + '::' + namespace;
	}
});

Object.defineProperty(String.prototype, "global", {
	enumerable   : false,
	configurable : false,
	get          : function(){
		let context = this.valueOf();
		let base    = path.basename(context);
		return global[base] = context.class;
	}
});

module.exports = String;