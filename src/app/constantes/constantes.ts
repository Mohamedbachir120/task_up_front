export const colors = ["50A060","7b68ee","5f48ea","E248AA","3498DB","F57C01"] 
export const baseUrl = "http://10.80.100.252:8000/api/"
export function randomColor<String>(id:number){
    const  color = colors[id % colors.length];
    return color;
}