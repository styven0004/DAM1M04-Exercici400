const midaCasella = 100;
let tauler = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 0]
];
let moviments = 0;
const taulerElement = document.getElementById('tauler');
const comptadorElement = document.getElementById('comptador');
const missatgeElement = document.getElementById('missatge');

function init() {
    crearTaulerDOM();
    barrejar();
    dibuixarTauler();
}

function crearTaulerDOM() {
    taulerElement.innerHTML = '';
    // Creem les 8 peces visuals (la 0 no la creem o la fem invisible)
    for (let i = 1; i <= 8; i++) {
        const div = document.createElement('div');
        div.classList.add('peca');
        div.id = `peca-${i}`;
        
        // Càlcul del tros d'imatge que li toca (posició original)
        const filaOrig = Math.floor((i - 1) / 3);
        const colOrig = (i - 1) % 3;
        div.style.backgroundPosition = `-${colOrig * midaCasella}px -${filaOrig * midaCasella}px`;
        
        div.addEventListener('click', () => clicPeca(i));
        taulerElement.appendChild(div);
    }
}

function dibuixarTauler() {
    for (let f = 0; f < 3; f++) {
        for (let c = 0; c < 3; c++) {
            const valor = tauler[f][c];
            if (valor !== 0) {
                const peca = document.getElementById(`peca-${valor}`);
                // Apliquem transform: translate per moure-la a la seva posició a la matriu
                peca.style.transform = `translate(${c * midaCasella}px, ${f * midaCasella}px)`;
            }
        }
    }
}

function trobarPosicio(valor) {
    for (let f = 0; f < 3; f++) {
        for (let c = 0; c < 3; c++) {
            if (tauler[f][c] === valor) return { f, c };
        }
    }
}

function clicPeca(valor) {
    const posPeca = trobarPosicio(valor);
    const posBuit = trobarPosicio(0);

    // Distància Manhattan
    const distansia = Math.abs(posPeca.f - posBuit.f) + Math.abs(posPeca.c - posBuit.c);

    if (distansia === 1) {
        // Intercanvi a la matriu
        tauler[posBuit.f][posBuit.c] = valor;
        tauler[posPeca.f][posPeca.c] = 0;
        
        moviments++;
        comptadorElement.innerText = moviments;
        dibuixarTauler();
        comprovarVictoria();
    }
}

function barrejar() {
    // Fem moviments aleatoris vàlids per assegurar que el puzle es pugui resoldre
    for (let i = 0; i < 100; i++) {
        const posBuit = trobarPosicio(0);
        const adjacents = [];
        
        if (posBuit.f > 0) adjacents.push({f: posBuit.f - 1, c: posBuit.c});
        if (posBuit.f < 2) adjacents.push({f: posBuit.f + 1, c: posBuit.c});
        if (posBuit.c > 0) adjacents.push({f: posBuit.f, c: posBuit.c - 1});
        if (posBuit.c < 2) adjacents.push({f: posBuit.f, c: posBuit.c + 1});
        
        const triada = adjacents[Math.floor(Math.random() * adjacents.length)];
        tauler[posBuit.f][posBuit.c] = tauler[triada.f][triada.c];
        tauler[triada.f][triada.c] = 0;
    }
    moviments = 0;
    comptadorElement.innerText = moviments;
    missatgeElement.classList.add('ocult');
}

function comprovarVictoria() {
    const estatGuanyador = [1, 2, 3, 4, 5, 6, 7, 8, 0];
    const actual = tauler.flat();
    const guanyat = actual.every((val, index) => val === estatGuanyador[index]);

    if (guanyat && moviments > 0) {
        missatgeElement.innerText = `Felicitats! Resolt en ${moviments} moviments.`;
        missatgeElement.classList.remove('ocult');
    }
}

document.getElementById('btn-reset').addEventListener('click', () => {
    barrejar();
    dibuixarTauler();
});

// Iniciar joc
init();