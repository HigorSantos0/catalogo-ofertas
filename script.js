const PRODS=[
  {id:1, img:'Fotos/cesta-vida.jpeg', name:'Cesta Vida + Urso + Coca', short:'Cesta Vida', desc:'Caixote de madeira rústico com urso de pelúcia, 2 latas de Coca-Cola, petiscos e bombons.', price:130, g:'g1', badge:''},
  {id:2, img:'Fotos/cesta-amor.jpeg', name:'Cesta Amor + Fotos + Urso', short:'Cesta Amor', desc:'Caixa romântica decorada com fotos polaroid, ursinho, Nutella, Doritos, Fini e Trento.', price:145, g:'g2', badge:'Mais pedido'},
  {id:3, img:'Fotos/buque.jpeg', name:'Buquê de Rosas + Ferrero', short:'Buquê Rosas', desc:'Clássico e romântico buquê de rosas vermelhas acompanhado de bombons Ferrero Rocher e balão.', price:160, g:'g3', badge:''},
  {id:4, img:'Fotos/cesta-premium.jpeg', name:'Cesta Coração + Bolo + Heineken', short:'Cesta Premium', desc:'Cesta luxo em formato de coração com mini bolo, cervejas Heineken, tábua de frios, amendoins e fotos.', price:185, g:'g4', badge:'Exclusivo'},
  {id:5, img:'Fotos/box-snacks.jpeg', name:'Box Black Snacks + Balão', short:'Box Snacks', desc:'Elegante box preto com laço vermelho recheado com Pringles, Doritos, Nutella, KitKat e balão.', price:120, g:'g5', badge:''},
  {id:6, img:'Fotos/ferrero.jpeg', name:'Mimo Ferrero + Balão', short:'Mimo Ferrero', desc:'Presente delicado com uma caixa de bombons Ferrero Rocher e um lindo balão de coração "Te amo".', price:75, g:'g6', badge:''},
  {id:7, img:'Fotos/mimo.jpeg', name:'Caixa Mimo Chocolates', short:'Caixa Chocolates', desc:'Caixa recheada de delícias contendo caixa de bombons Garoto, Bis, Ouro Branco e Baton.', price:85, g:'g1', badge:'Novidade'},
];

let cart=[],favs=new Set();

function fmt(v){return'R$ '+v.toFixed(2).replace('.',',')}

function cardHTML(p){
  return`<div class="pcard" id="pc${p.id}">
    <div class="pcard-img">
      <div class="pcard-img-bg ${p.g}"></div>
      ${p.badge?`<div class="pcard-badge">${p.badge}</div>`:''}
      <img src="${p.img}" alt="${p.short}" style="width:130px; height:130px; object-fit:cover; border-radius:50%; position:relative; z-index:2; box-shadow:0 8px 20px rgba(0,0,0,0.15); border:4px solid #fff; transition:transform .3s;">
      <button class="pcard-fav${favs.has(p.id)?' active':''}" onclick="toggleFav(${p.id},this)" aria-label="Favoritar"><i class="ti ti-heart" aria-hidden="true"></i></button>
    </div>
    <div class="pcard-body">
      <div class="pcard-name">${p.name}</div>
      <div class="pcard-desc">${p.desc}</div>
      <div class="pcard-footer">
        <span class="pcard-price">${fmt(p.price)}</span>
        <button class="add-btn" id="abtn${p.id}" onclick="addCart(${p.id})"><i class="ti ti-shopping-cart" aria-hidden="true"></i> Adicionar</button>
      </div>
    </div>
  </div>`;
}

function heroCardHTML(p){
  return `<div class="h-card">
    <img src="${p.img}" alt="${p.short}" style="width:55px; height:55px; object-fit:cover; border-radius:12px; margin-bottom:.6rem; box-shadow:0 4px 10px rgba(0,0,0,0.08);">
    <div class="h-card-name">${p.short}</div>
    <div class="h-card-price">${fmt(p.price)}</div>
  </div>`;
}

function initRender(){
  document.getElementById('heroCards').innerHTML=PRODS.slice(0,3).map(heroCardHTML).join('');
  document.getElementById('homeGrid').innerHTML=PRODS.map(cardHTML).join('');
  document.getElementById('catalogGrid').innerHTML=PRODS.map(cardHTML).join('');
}

function toggleFav(id,btn){favs.has(id)?favs.delete(id):favs.add(id);btn.classList.toggle('active');}

function addCart(id){
  const p=PRODS.find(x=>x.id===id);
  cart.push({...p,uid:Date.now()+Math.random()});
  updateBadge();showToast(p.short+' adicionado! 🛍️');
  const btn=document.getElementById('abtn'+id);
  if(btn){btn.innerHTML='✓ Adicionado';btn.style.background='linear-gradient(135deg,#25D366,#128C7E)';setTimeout(()=>{btn.innerHTML='<i class="ti ti-shopping-cart" aria-hidden="true"></i> Adicionar';btn.style.background='';},1500);}
}

function updateBadge(){document.getElementById('cartBadge').textContent=cart.length;}

// Substitua a função openWhatsApp existente por esta:
function openWhatsApp(mensagem) {
  const telefone = '5521994958427';
  const encoded = encodeURIComponent(mensagem);
  const isAndroid = /android/i.test(navigator.userAgent);
  
  if (isAndroid) {
    // intent:// é a forma garantida no Chrome Android
    const intentUrl = `intent://send?phone=${telefone}&text=${encoded}#Intent;scheme=whatsapp;package=com.whatsapp;end`;
    window.location.href = intentUrl;
  } else {
    window.open(`https://wa.me/${telefone}?text=${encoded}`, '_blank');
  }
}

// ==================== FUNÇÃO PRINCIPAL ====================
function renderCart(){
  const el = document.getElementById('cartContent');
  
  if(!cart.length){
    el.innerHTML = `<div class="cart-empty-wrap"><div class="cart-empty-icon"><i class="ti ti-heart" aria-hidden="true"></i></div><div class="cart-etitle">Carrinho vazio</div><div class="cart-esub">Adicione presentes do catálogo para montar seu pedido especial</div><button class="btn-glow" onclick="goPage('catalog',null)">Ver Catálogo</button></div>`;
    return;
  }
  
  const total = cart.reduce((s,i)=>s+i.price,0);

  let mensagem = 'Olá! Gostaria de finalizar meu pedido:\n\n';
  cart.forEach(item => { mensagem += `- ${item.name}: ${fmt(item.price)}\n`; });
  mensagem += `\nTotal: ${fmt(total)}`;
  const waUrl = `https://wa.me/5521994958427?text=${encodeURIComponent(mensagem)}`;

  el.innerHTML = cart.map((item,idx)=>`
    <div class="ci">
      <img src="${item.img}" alt="${item.short}" style="width:64px; height:64px; object-fit:cover; border-radius:12px; flex-shrink:0; border:1px solid rgba(0,0,0,0.08);">
      <div class="ci-info">
        <div class="ci-name">${item.name}</div>
        <div class="ci-desc">${item.desc.slice(0,55)}…</div>
      </div>
      <div class="ci-price">${fmt(item.price)}</div>
      <button class="ci-remove" onclick="removeCart(${idx})" aria-label="Remover"><i class="ti ti-x" aria-hidden="true"></i></button>
    </div>`).join('') + `
    <div class="cart-sum">
      <div class="sum-label">Total do pedido</div>
      <div class="sum-total">${fmt(total)}</div>
      
      <button class="wa-btn" onclick="openWhatsApp('${mensagem.replace(/'/g, "\\'")}')">
        <i class="ti ti-brand-whatsapp" aria-hidden="true"></i>
        Finalizar pelo WhatsApp
      </button>
    </div>`;
}

// ==================== OUTRAS FUNÇÕES ====================
function removeCart(idx){cart.splice(idx,1);updateBadge();renderCart();}
function showToast(msg){const t=document.getElementById('toast');t.textContent=msg;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),2200);}

function goPage(name,link){
  document.querySelectorAll('.page').forEach(p=>p.classList.remove('active'));
  document.getElementById('page-'+name).classList.add('active');
  document.querySelectorAll('.nav-links a').forEach(a=>a.classList.remove('active'));
  if(link)link.classList.add('active');
  if(name==='cart')renderCart();
  window.scrollTo(0,0);
}

function initParticles(){
  const canvas=document.getElementById('particles');
  const hero=document.getElementById('heroSection');
  if(!canvas||!hero)return;
  const ctx=canvas.getContext('2d');
  function resize(){canvas.width=hero.offsetWidth;canvas.height=hero.offsetHeight;}
  resize();window.addEventListener('resize',resize);
  const P=[];
  for(let i=0;i<55;i++){P.push({x:Math.random()*canvas.width,y:Math.random()*canvas.height,r:Math.random()*2.5+.5,vx:(Math.random()-.5)*.4,vy:(Math.random()-.5)*.4,a:Math.random(),da:(Math.random()-.5)*.008,hue:Math.random()<.5?0:300});}
  function draw(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    P.forEach(p=>{p.x+=p.vx;p.y+=p.vy;p.a+=p.da;if(p.a<=0||p.a>=1)p.da*=-1;if(p.x<0)p.x=canvas.width;if(p.x>canvas.width)p.x=0;if(p.y<0)p.y=canvas.height;if(p.y>canvas.height)p.y=0;ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);ctx.fillStyle=`hsla(${p.hue},100%,70%,${p.a*.6})`;ctx.fill();});
    requestAnimationFrame(draw);
  }
  draw();
}

function initReveal(){
  const obs=new IntersectionObserver((entries)=>{entries.forEach(e=>{if(e.isIntersecting){e.target.style.opacity='1';e.target.style.transform='translateY(0)';}});},{threshold:.1});
  document.querySelectorAll('.pcard,.feat,.h-card').forEach(el=>{el.style.opacity='0';el.style.transform='translateY(24px)';el.style.transition='opacity .5s ease, transform .5s ease';obs.observe(el);});
}

initRender();
setTimeout(()=>{initParticles();initReveal();},100);