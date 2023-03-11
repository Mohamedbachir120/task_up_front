export const colors = ["50A060","7b68ee","5f48ea","E248AA","3498DB","F57C01"] 
export const backend_server = "http://192.168.85.137:8000/" 
export const baseUrl = backend_server+"api/"
export function randomColor<String>(id:number){
    const  color = colors[id % colors.length];
    return color;
}
export const hours = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23]
export const months = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];
export const days = ["Dimanche","Lundi","Mardi","Mercredi","Jeudi","Vendredi","Samedi"]
export const monthNumberDays =  new Map(Object.entries( {
    "Janvier":31,
    "Février":28,
    "Mars":31,
    "Avril":30,
    "Mai":31,
    "Juin":30,
    "Juillet":31,
    "Août":31,
    "Septembre":30,
    "Octobre":31,
    "Novembre":30,
    "Décembre":31}))
