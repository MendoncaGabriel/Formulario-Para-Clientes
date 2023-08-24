const firebaseConfig = {
    apiKey: "AIzaSyDYbXMcWZEO8OWvH0xiJP-6JsMhIStHB1I",
    authDomain: "formulario-criacao-de-pagina.firebaseapp.com",
    projectId: "formulario-criacao-de-pagina",
    storageBucket: "formulario-criacao-de-pagina.appspot.com",
    messagingSenderId: "764180015223",
    appId: "1:764180015223:web:99aad7c258a85cde1dbe72",
    measurementId: "G-NQTNEPKYGQ"
  };
  
  // Initialize Firebase
  const app = firebase.initializeApp(firebaseConfig);
  const db = app.firestore()
  const storage = firebase.storage();



function carregarFormularios(){
    const clientes = document.getElementById('clientes')

    const docRef = db.collection('clientes')
    docRef.get()
    .then((element)=>{
    
        let clientesElement = ''
        element.forEach(element => {
            clientesElement += `        
            <div class="h-auto w-full shadow-md  border-2 p-5 grid grid-cols-4 justify-between items-center">

            <!--- Nome  --->
            <div class=" col-span-3 flex items-center justify-between">
                <h2 class="text-2xl ml-5 ">${element.data().contato}</h2>
            </div>

            <!--- Logo  --->
            <div class=" col-span-1  ">
                <img src="${logo(element.data().imagemURL)}"  alt="logo" class="max-h-28 m-auto">
                <button class="bg-red-300 text-red-900 font-bold px-3 py-2 rounded-md ml-auto m-auto block mt-5" onclick="ExcuirFormulario('${element.id}')">Excluir</button>
            </div>
            <button class="col-span-4 border m-2 bg-gray-200" onclick="maisSobre(this)">Mais sobre</button>

            <!--- Informações  --->
            <table class="table-auto border col-span-4 hidden ">
                <thead class="border text-left">
                  <tr>
                    <th>Telefone</th>
                    <th>E-mail</th>
                  </tr>
                </thead>
                <tbody>
                  <tr class="border">
                    <td>${element.data().telefone}</td>
                    <td>${element.data().email}</td>
                  </tr>
                </tbody>
              </table>
            
        </div>`
    
            clientes.innerHTML += clientesElement
        });
    
        function logo(img){
            if(img){
                return img
            }else{
                return 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'
            }
            
        }
        
    })
    
} carregarFormularios()

function ExcuirFormulario(id){

    let deletar = prompt('Deseja apagar dados do cliente?: s / n')

    if(deletar == 's'){
        const docRef = db.collection('clientes').doc(id)
        docRef.get()
        //apagar imagens
        .then((element)=>{
            
            //apagar imagem
            ExcluirImagem(element.data())
    
            //apagar formulario
            docRef.delete()
            .then(()=>{
                console.log('Formualrio apagado!')
                carregarFormularios()
            })
        })
    }
    
}

function ExcluirImagem(imagePath){
   if(imagePath.fileName){
    const imageRef = storage.ref().child('images/'+imagePath.fileName);
    imageRef.delete().then(() => {
      console.log("Imagem excluída com sucesso!");
    }).catch((error) => {
      console.error("Erro ao excluir imagem:", error);
    });
   }else{
    return false
   }


}

let MaisSobre = false
function maisSobre(id){
    let elemento = id.parentNode
    
   
    
    
    
    if(MaisSobre == false){
        MaisSobre = true
        elemento.children[3].style.display = 'table'
    }else{
        MaisSobre = false
        elemento.children[3].style.display = 'none'
    }
    
}
