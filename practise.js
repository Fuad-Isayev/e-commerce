let url = "https://ik.imagekit.io/f5u3a9d5/Image_18__vM_m4WgT.jpg"

let urlParts = url.split('/');
urlParts[urlParts.length - 1] = "tr:w-300/" + urlParts[urlParts.length - 1];
let imgURL = urlParts.join('/');

console.log(imgURL)