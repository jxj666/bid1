function key(name){
	return `
	 mkdir ${name} 
	 cd ${name}
	 touch ${name}.html
	 touch main.scss
	 touch main.js 
	 cd ../
	 `;
}
key()