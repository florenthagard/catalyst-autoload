const fs   		 = require('fs');
const path   	 = require('path');

let modules 	 = {
	FWD : {},
	CWD : {},
	MDL : {}
};

process.env.FWD  = path.normalize(__dirname+"/../../");

Object.defineProperty(String.prototype, "class", {
	enumerable   : false,
	configurable : false,
	get          : function(){

		let context   = this.valueOf().split('::');
		let namespace = context.pop();
			context   = context.shift() || "FWD";
		let filename  = namespace.split('/').pop();

		if (modules[context][filename]){
			return modules[context][filename];
		}

		let pathname  = path.normalize(process.env[context] + '/' + namespace);
		
		if (fs.existsSync(pathname + '.js')
		||  fs.existsSync(pathname + '.json')){
			try {
				let classLoad = require(pathname);
				if (classLoad.name && classLoad.name === filename){
					return modules[context][namespace] = classLoad;
				}	return classLoad;
			} catch(e) {
				console.log(e);
				let className = /ReferenceError: (.*) is/gi.exec(e.stack);
				if (className){
					className[1].class;
					//return namespace.class;
				}
			}
		}

		console.log(context + '::' + namespace);
		return context + '::' + namespace;
	}
});

Object.defineProperty(String.prototype, "module", {
	enumerable   : false,
	configurable : false,
	get          : function(){
		return require(this.valueOf());
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