export const colors = ["50A060","7b68ee","5f48ea","E248AA","3498DB","F57C01"] 
export const backend_server = "http://172.20.10.5:8000/" 
export const baseUrl = backend_server+"api/"
export function randomColor<String>(id:number){
    const  color = colors[id % colors.length];
    return color;
}