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
const db = app.firestore();


document.getElementById("meuFormulario").addEventListener("submit", async function(event) {
  loadOn() //load
  event.preventDefault(); // Impede o envio padrão do formulário

  const formData = leitura()

  if (formData.imageFile) { //verificar se tem imagem para salvar
    let img = await salvarImagem(formData)
    formData.imagemURL = img.url
    formData.fileName = img.fileName
    salvarFormulario(formData)

  }else{
    salvarFormulario(formData) //salvar formulario sem imagem
  }

  document.getElementById("meuFormulario").reset(); // Limpar os campos do formulário
});


function leitura(){
  const imageFile = document.getElementById('logotipo').files[0];
  const nomeEmpresa = document.getElementById("nomeEmpresa").value;
  const ramoAtuacao = document.getElementById("ramoAtuacao").value;
  const email = document.getElementById("email").value;
  const contato = document.getElementById("contato").value;
  const telefone = document.getElementById("telefone").value;
  const dominio = document.querySelector('input[name="dominio"]:checked').value;
  const observacoes = document.getElementById("observacoes").value;
  const conteudo = document.getElementById('conteudo').value; 
  const funcionalidades = document.getElementById('funcionalidades').value ;
  const referencias = document.getElementById('referencias').value ;
  const prazo = document.getElementById('prazo').value ;

  const formData = {
    registro: new Date(),
    imageFile: '',
    imgName: '',
    nomeEmpresa: nomeEmpresa,
    ramoAtuacao: ramoAtuacao,
    email: email,
    contato: contato,
    telefone: telefone,
    dominio: dominio,
    observacoes: observacoes,
    imagemURL: '',
    conteudo: conteudo,
    funcionalidades: funcionalidades ,
    referencias: referencias ,
    prazo: prazo,
  };

  if(imageFile){
    formData.imageFile = imageFile
  };

  return formData
}

function salvarFormulario(formData){
  formData.imageFile = '' //Remove arquivo - "NECESSARIO PARA FUNCIONAMENTO!": Não e possivel salvar o arquivo diretamente, a imagem e salva somente a url em (imagemURL), 
  const docRef = db.collection("clientes").doc();
  
  docRef.set(formData)
  .then(()=>{
    alerta()
    loadOff() //esconder load
  })
}

async function salvarImagem(formData){
  try{
    const storageRef = firebase.storage().ref();

    const fileName = new Date().getTime() + '_' + formData.imageFile.name;  //modifica nome da imagem
    const imageRef = storageRef.child('images/' + fileName);
    await imageRef.put(formData.imageFile); // Faz o upload do arquivo para o Storage
    const url = await imageRef.getDownloadURL() //retornar a url da imagem no storage()
    console.log('imagem salva!')
  
    return  {url: url, fileName: fileName}
  }catch(erro){
    console.log('Erro ao salvar imagem: ', erro)
  }
}

const load = document.getElementById('load')
function loadOn(){
  load.style.display = 'flex'
}
function loadOff(){
  load.style.display = 'none'

}

function alerta(){
  const alerta = document.getElementById('alertaEnvio')
  alerta.style.display = 'block'

  setTimeout(() => {
    alerta.style.display = 'none'
    direcionarWhatsApp()
  }, 2000);
}

function direcionarWhatsApp(){
  const phoneNumber = "995238016"; // Substitua pelo número de telefone desejado
  const message = "Pronto!, acabei de preencher o formulário de orçamento.";
  const whatsappURL = `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${encodeURIComponent(message)}`;

  // Redireciona para o WhatsApp
  window.location.href = whatsappURL;


}