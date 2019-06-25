module.exports = class Namespace extends String {
	add(str){
		return new Namespace(this.valueOf() + '/' + str);
	}

	static fromString(string){
		return new this(string);
	}
}
