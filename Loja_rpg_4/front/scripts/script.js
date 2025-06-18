// API CALLS
//Remove produto na posição id_index
async function remove_product_at(id_index) {
  try {
    const response = await fetch(`http://localhost:5000/api/products/${id_index}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error(`Failed to remove product: ${response.status}`);
    }

    const result = await response.json();
    console.log('Product removed:', result);
  } catch (error) {
    console.log("failed to remove: ", error)
  }
}


async function getProducts() {
  try {
    const response = await fetch('http://localhost:5000/api/products');
    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.status}`);
    }

    const data = await response.json();
    // Do something with the product list
    console.log('Products:', data.products)

    return data.products; 
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}

async function renderProducts() {
  const products = await getProducts();  
  const container = document.getElementById('product-list');  
  const container2 = document.getElementById('product-list-edit');
  
  //Edição
  if (!container || container2) {
    
    console.log("Edicção")
    container2.innerHTML = '';  

    products.forEach(product => {
      const div = document.createElement('div');   
      div.className = 'product';
      div.innerHTML = `
        <img src="${product.image || 'placeholder.png'}" alt="${product.name}" width="200" />
        <h3>${product.name || 'Produto sem nome'}</h3>
        <button class="editar-btn">Selecionar id</button>
      `;
      const botao = div.querySelector('.editar-btn');
      botao.addEventListener('click', () => auto_colocar_id(product));
     
      
      container2.appendChild(div);  
  });

  //Exibição 
  } else if (container || !container2) {
    //Exibição compra
    container.innerHTML = '';  

    products.forEach(product => {
      const div = document.createElement('div');   
      div.className = 'product';
      div.innerHTML = `
        <img src="${product.image || 'placeholder.png'}" alt="${product.name}" width="200" />
        <h3>${product.name || 'Produto sem nome'}</h3>
        <p>${product.description || 'Sem descrição'}</p>
        <p><b>Preço:</b> R$ ${parseFloat(product.price).toFixed(2)}</p>
            <button class="comprar-btn">Comprar</button>
      `;

      // Botão "Comprar" funcional
      const botao = div.querySelector('.comprar-btn');
      botao.addEventListener('click', () => adicionarAoCarrinho(product));
      
      container.appendChild(div);  
  });
  } else if (container && !container2) {
    return;
  }

  
}

async function saveProduct(class_object) {
  try {


    const product = {
        name: class_object.nome, // place the name here,
        description: class_object.desc, // place the decription,
        price: class_object.preco,//plce the price here,
        image: class_object.imgUrl// place the image path here
    };

    const response = await fetch('http://localhost:5000/api/products', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(product)
    });

    if (!response.ok) {
      throw new Error(`Failed to save product: ${response.status}`);
    }

    const savedProduct = await response.json();
    console.log('Product saved:', savedProduct);
    // do somethig else here

  } catch (error) {
    console.error('Error saving product:', error);
    return null;
  }
}


async function updateProduct(id, updatedProduct) {
  try {
    const response = await fetch(`http://localhost:5000/api/products/${id}`, {
      method: 'PUT', // ou 'PATCH' dependendo da sua API
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updatedProduct)
    });

    if (!response.ok) {
      throw new Error(`Failed to update product: ${response.status}`);
    }

    const result = await response.json();
    console.log('Product updated:', result);
    return result;
  } catch (error) {
    console.error('Error updating product:', error);
    return null;
  }
}

////////////////////////////////////


//FUNÇÕES NORMAIS

function auto_colocar_id(d, preEncher_resto = true) {
  console.log(d)
  document.getElementById("id_produto").value = d.id
  document.getElementById("E_nome").value = d.name
  document.getElementById("E_desc").value = d.description
  document.getElementById("E_preco").value = d.price
  document.getElementById("E_url").value = d.image
}




// Exemplo de uso ao exibir os dados
//document.getElementById('product-list').innerHTML = decodeUTF8(seuTextoComAcentos);


function verificarContinuacao(cancelText = "Operação cancelada") {
    const resposta = confirm("Deseja realmente continuar esta operação?");
    
    if (resposta) {
        
    } else {
        alert(cancelText);
    }
    return resposta
}


function adicionarAoCarrinho(product) {
  carrinho.push(product);
  atualizarCarrinho();
}

function atualizarCarrinho() {
  const itensDiv = document.getElementById('itens-carrinho');
  if (!itensDiv) return;

  itensDiv.innerHTML = ''; // limpa o conteúdo anterior

  let total = 0;

  carrinho.forEach((item) => {
    const preco = parseFloat(item.price) || 0;
    total += preco;

    itensDiv.innerHTML += `
      <p>${item.name} - R$ ${preco.toFixed(2)}</p>
    `;
  });

  // Exibir o total no final do popup
  itensDiv.innerHTML += `<hr><p><strong>Total: R$ ${total.toFixed(2)}</strong></p>`;
}




//CLASSES




class produtoAdicicao {
  constructor(nome, descricao = "nada", preco = 0.10,url = null) {
    this.nome = nome;
    this.desc = descricao;
    this.preco = preco;
    this.imgUrl = url;
  }
}

class produtoEdicao {
  constructor(id, nome = "", descricao = "",preco = "",url = "") {
    this.id = id
    this.nome = nome 
    this.desc = descricao
    this.preco = preco 
    this.img = url
  };

  return_dic() {
    return {
      "id": this.id,
      "description": this.desc,
      "name": this.nome,
      "price": this.preco,
      "image": this.img

    }
  };
}


//ASYNCS

async function del_produto() {
  let f = document.getElementById("id_produto").value
  let d = verificarContinuacao()
  
  if (d) {
    await remove_product_at(f);
    
    location.reload();
  }
}

async function editar_produto() {
  // if (newName == "") {
  //   console.log("Vazioo")
  // }
  
  // var objeto = new produtoEdicao(
  //   document.getElementById("id_produto").value
  // )
  // console.log("Aaaaaaaa ",array_e)
  var objeto
  let id_ = document.getElementById("id_produto").value
  // let newName = document.getElementById("E_nome").value
  
  let array_e = [
    document.getElementById("E_nome").value,
    document.getElementById("E_desc").value,
    document.getElementById("E_preco").value,
    document.getElementById("E_url").value
  ]
  


  console.log("Aqui: ", await getProducts());

  var produtos = await getProducts();
  const keys = Object.keys(produtos);
  
  keys.forEach(key => {
    if (produtos[key]["id"] == id_) {
      // console.log("Esse é o certo", produtos[key])
      objeto = new produtoEdicao(
        id_,
        array_e[0],
        array_e[1],
        array_e[2],
        array_e[3]

      ) 
    }
    
  })

  var novo_obj = objeto.return_dic();
  var antigo_item
  keys.forEach(key => {
    if (produtos[key]["id"] == novo_obj.id) {
      console.log("a", novo_obj);
      console.log("b", produtos[key]);
      antigo_item = produtos[key]
    }
    
  })


  if (novo_obj.name != null && novo_obj.name != "") {
    antigo_item.name = novo_obj.name;
  }
  if (novo_obj.description != null && novo_obj.description != "") {
    antigo_item.description = novo_obj.description;
  }
  if (novo_obj.price != null && novo_obj.price != "") {
    antigo_item.price = novo_obj.price;
  }
  if (novo_obj.image != null && novo_obj.image != "") {
    antigo_item.image = novo_obj.image;
  }


  console.log("sobreescrito", antigo_item)


  let aaa = verificarContinuacao() 

  if (aaa) {
    await updateProduct(antigo_item.id, antigo_item)
    location.reload();
  }

  
}



//ETC

$("#addProduto").click(function() {
   var obj = new produtoAdicicao(
    document.getElementById("nomeProduto").value,
    document.getElementById("DescProduto").value,
    document.getElementById("PrecoProduto").value,
    document.getElementById("urlProduto").value,
   )
   console.log(obj);
   saveProduct(obj);
   getProducts();
});

document.addEventListener('DOMContentLoaded', () => {
  renderProducts();
});


// saveProduct();
// remove_product_at(3);
// getProducts();
// console.log("Oi")





const btnCarrinho = document.getElementById('abrir-carrinho');
if (btnCarrinho) {
  btnCarrinho.addEventListener('click', () => {
    const popup = document.getElementById('carrinho-popup');
    popup.style.display = popup.style.display === 'none' ? 'block' : 'none';
  });
}

getProducts();
const carrinho = [];