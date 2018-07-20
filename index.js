const fs   		 = require('fs');
const path   	 = require('path');
let modules 	 = {};

process.env.FWD  = path.normalize(__dirname+"/../");

Object.defineProperty(String.prototype, "class", {
	enumerable   : false,
	configurable : false,
	get          : function(){

		let context = this.valueOf();
		if (modules[context]){
			return modules[context];
		}	
			context   = this.valueOf().split('::');
		let namespace = context.pop();
			context   = context.shift() || "FWD";
		let filename  = namespace.split('/').pop();

		if (fs.existsSync(process.env[context] + '/' + namespace + '.js')){
			let classLoad = require(process.env[context] + '/' + namespace);
			if (classLoad.name && classLoad.name === filename){
				return modules[context] = classLoad;
			}
		}

		return context + '::' + namespace;
	}
});


module.exports = String;