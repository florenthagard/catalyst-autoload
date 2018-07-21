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

		if (fs.existsSync(process.env[context] + '/' + namespace + '.js')
		||  fs.existsSync(process.env[context] + '/' + namespace + '.json')){
			try {
				let classLoad = require(process.env[context] + '/' + namespace);
				console.log(classLoad,classLoad.name,filename,classLoad.name === filename);
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
			console.log(process.env[context] + '/' + namespace + '.js');
		}

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