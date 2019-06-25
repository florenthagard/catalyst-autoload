const fs   		 = require('fs');
const path   	 = require('path');
const Namespace  = require(__dirname + '/lib/Namespace');

process.env.FWD  = path.normalize( __dirname + "/../../" ).replace(/\/$/,'');
global.modules 	 = {
	FWD : {},
	PWD : {},
	MDL : {}
};

Object.defineProperty(String.prototype, "class", {
	enumerable   : false,
	configurable : false,
	get          : function(){

		let context   = this.valueOf().split('::');
		let namespace = context.pop();
			context   = context.shift() || 'FWD';
		let filename  = namespace.split('/').pop();

		if (modules[context][filename]){
			return modules[context][filename];
		}

		let pathName  = path.normalize(process.env[context] + '/' + namespace);
		try {
			let classLoad = require(pathName);
			if (classLoad.name && classLoad.name === filename){
				return modules[context][namespace] = classLoad;
			}	return classLoad;
		} catch(e) {
			let ReferenceError = /ReferenceError: (.*) is/gi.exec(e.stack);
			if (ReferenceError){
				console.log(e);
				process.exit();
			}
			let Error = /Error:.*'(.*)'/gi.exec(e.stack);
			if (Error && e.code === "MODULE_NOT_FOUND"){
				let indexPathName = namespace +'/index';
				let basePathName  = namespace +'/'+ path.basename(pathName);

				if (fs.existsSync(process.env[context] +'/'+ indexPathName + '.js')){
					return indexPathName.class
				}

				if (fs.existsSync(process.env[context] +'/'+ basePathName + '.js')){
					return basePathName.class
				}

				let inThisNameSpace = RegExp('\\((?:' + process.env.PWD + '|' + process.env.FWD + ')(.*):.*:.*',"gi").exec(e.stack.split('\n')[9]);
				if (inThisNameSpace && !__filename.match(inThisNameSpace[1]+'$')){
					inThisNameSpace = path.dirname(inThisNameSpace[1]) + '/' +namespace;
					
					return inThisNameSpace.class;
				}

				if (!namespace.match(/::/gi)){
					return ('PWD::' + path.normalize(namespace)).class
				}
			}
		}

		return namespace.replace(/(P|F)WD::/gi,'');
	}
});

Object.defineProperty(String.prototype, "classDetails", {
	enumerable   : false,
	configurable : false,
	get          : function(){

		let context   = this.valueOf().split('::');
		let namespace = context.pop();
			context   = context.shift() || 'FWD';
		let filename  = namespace.split('/').pop();

		console.log('context',context);
		console.log('filename',filename);
		console.log('namespace',namespace);

		if (modules[context][filename]){
			console.log('a');
			return modules[context][filename];
		}

		let pathName  = path.normalize(process.env[context] + '/' + namespace);
		try {
			let classLoad = require(pathName);

			console.log('===>',classLoad);

			if (classLoad.name && classLoad.name === filename){
				console.log('b');
				return modules[context][namespace] = classLoad;
			}	
			console.log('c');
			return classLoad;
		} catch(e) {
			let ReferenceError = /ReferenceError: (.*) is/gi.exec(e.stack);
			if (ReferenceError){
				console.log(e);
				process.exit();
			}
			let Error = /Error:.*'(.*)'/gi.exec(e.stack);
			if (Error && e.code === "MODULE_NOT_FOUND"){
				let indexPathName = namespace +'/index';
				let basePathName  = namespace +'/'+ path.basename(pathName);

				if (fs.existsSync(process.env[context] +'/'+ indexPathName + '.js')){
					console.log('d');
					return indexPathName.class
				}

				if (fs.existsSync(process.env[context] +'/'+ basePathName + '.js')){
					console.log('e');
					return basePathName.class
				}

				let inThisNameSpace = RegExp('\\((?:' + process.env.PWD + '|' + process.env.FWD + ')(.*):.*:.*',"gi").exec(e.stack.split('\n')[9]);
				if (inThisNameSpace && !__filename.match(inThisNameSpace[1]+'$')){
					inThisNameSpace = path.dirname(inThisNameSpace[1]) + '/' +namespace;
					console.log('f',inThisNameSpace.classDetails);
					return inThisNameSpace.class;
				}

				if (!namespace.match(/::/gi)){
					console.log('g',('PWD::' + path.normalize(namespace)).classDetails);
					return ('PWD::' + path.normalize(namespace)).class
				}
			}
		}

		console.log('h');
		return namespace.replace(/(P|F)WD::/gi,'');
	}
});

Object.defineProperty(String.prototype, "module", {
	enumerable   : false,
	configurable : false,
	get          : function(){
		let moduleName = this.valueOf();
		if ( modules.MDL[moduleName] ){
			return modules.MDL[moduleName]
		} 	return modules.MDL[moduleName] = require(moduleName);
	}
});

Object.defineProperty(global, "__namespace", {
	enumerable   : false,
	configurable : false,
	get          : function(){
		let file = new Error().stack.split('\n')[2].match(/\(.*\)/gi)[0].replace(/\(|\)/gi,'').split(':')[0];
		let dir  = path.dirname(file);
		let ctx  = dir.match(process.env.FWD) ? 'FWD' : 'PWD';
			dir  = dir.match(process.env.FWD) ? dir.replace(process.env.FWD+'/','') : dir.replace(process.env.PWD+'/','');
		let ns   = ctx+'::'+ dir;

		return Namespace.fromString(ns);
	}
});
		
		/*let stack     = new Error().stack.split('\n').filter( v => { return v.match(/\(\/(.*)\)/gi) }).reduce((accumulateur,valeurCourante,index,array) => {
			if (!accumulateur && !valeurCourante.match(/String.get/gi)){
				return valeurCourante;
			}	return accumulateur
		},false);//.filter( v => { return v.match(/\(\/(.*)\)/gi) && !v.match(/internal/gi) ? true : false } );

		//if(!context) {
			context   = !context 
							? stack.match(process.env.FWD)
								? 'FWD' 
								: 'PWD'
							: context;
		//}

		//console.log(stack[1]);
		*/

Object.defineProperty(String.prototype, "global", {
	enumerable   : false,
	configurable : false,
	get          : function(){
		let context = this.valueOf();
		let base    = path.basename(context);

		if ( global[base] ){
			return global[base];
		} 	return global[base] = context.class;
	}
});

Object.defineProperty(Object.prototype, "global", {
	enumerable   : false,
	configurable : false,
	get          : function(){
		if (!this.name || global[this.name]){
			throw new Error('Cant register '+ this.name +' for a global access');
		}	return global[this.name] = this;
	}
});
