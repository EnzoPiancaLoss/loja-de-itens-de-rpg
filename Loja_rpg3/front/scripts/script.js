// API CALLS
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
  if (!container) return;

  container.innerHTML = '';  

  products.forEach(product => {
    const div = document.createElement('div');   
    div.className = 'product';
    div.innerHTML = `
      <img src="${product.image || 'placeholder.png'}" alt="${product.name}" width="200" />
      <h3>${product.name || 'Produto sem nome'}</h3>
      <p>${product.description || 'Sem descrição'}</p>
      <p><b>Preço:</b> R$ ${parseFloat(product.price).toFixed(2)}</p>
    `;
    container.appendChild(div);  
  });
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


class produtoAdicicao {
  constructor(nome, descricao = "nada", preco = 0.10,url = null) {
    this.nome = nome;
    this.desc = descricao;
    this.preco = preco;
    this.imgUrl = url;
  }
}

class produtoEdicao {
  constructor(id, nome = "",descricao = "",preco = "",url = "") {
    this.id = id
    this.nome = nome 
    this.desc = descricao
    this.preco = preco 
    this.img = url
  };

  get return_dic() {
    return {
      "id": this.id,
      "description": this.desc,
      "name": this.name,
      "price": this.preco,
      "image": this.img

    }
  };
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
  let newName = document.getElementById("E_nome").value
  
  let array_e = [
    document.getElementById("E_nome").value,
    document.getElementById("E_desc").value,
    document.getElementById("E_preco").value
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
        array_e[2]

      ) 
    }
    
  })

  console.log(objeto.return_dic());

}

// $("#btn_editar").click(function() {
//   nome()
//   // var obj = new produtoEdicao(

//   // )
// });

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

getProducts();
// saveProduct();
// remove_product_at(3);
// getProducts();
// console.log("Oi")