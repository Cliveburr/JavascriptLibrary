

container.x

test.x


test.x + test.height

container.x + container.height



r1.x

r2.x


r2.x + r2.height

r1.x + r1.height



uma grid tem um limite maximo para se dividr
uma grid tem um limite minimo para se fundir


insert
	pega a grid root
	
		checa 





low in x axis is the left side
low in y axis is the bottom side


Point
	x: number
	y: number
	segs: Segment[]

Segment
	axis: { x or y }
	plow: Point
	phigh: Point

Box
	top: Segment
	bottom: Segment
	left: Segment
	right: Segment

Position
	pos: number
	low: Position
	high: Position

Array
	axis: { x or y }
	insert(Segment)



pegar os points no intervalo X
cada points tem varios objetos
|
|
|  |
[    ] 
pegar os points no intervalo Y
[] ---


Array in X
	positions
		Array in Y
			positions
				object






----- mover
- se y for positivo e x for positivo
	pegar a array y+x+ com os objetos mais proximos
		pegar a distancia até eles
			se for menor doque a distancia a percorrer
				mover até a posição
				atualizar objetos parentes
			se for maior
				checar a colisão com algum deles
					se não colidiu
						mover em distancia
						atualizar objetos parentes
		subtrair a distancia movida do total a mover
	se houver ainda distanica a mover, repetir
	



- atualizar objetos parentes
	se o deslocamento em y for positivo
		checar a posição se for maior ou igual doque os dois quadrantes superiores
			se for maior, efetuar a troca das relações
	se y for negativo
		checar a posição se for menor doque os dois quadrantes inferiores
			se for menor, efetuar a troca das relações
	se x for positivo
		checar a posição se for maior ou igual doque os dois quadrantes a direita
			se for maior, efetuar a troca das relações
	se x for negativo
		checar a posição se for menor doque os dois quadrantes a esquerda
			se for menor, efetuar a troca das relações




----- mover
	gerar o vetor do movimento
	para cada relação, checar se a direção do vetor de movimento é a mesma
	se for, checar por colisão
		se colidir
			mover até 1 posição antes
			checar relações
			retornar falso
	se não colidir
		mover até 
		

vector = x: 2, y: 1


p1 = x: 20, y: 10
p2 = x: 10, y: 20


h2 = co2 + ca2 




ax
ay
bx
by

(ax >= bx && ax <= by)
|| (ay >= bx && ay <= by)
|| (bx >= ax && bx <= ay)
|| (by >= ax && by <= ay)


(ax >= bx && ax <= by)
|| (ay >= bx && ay <= by)
|| (bx >= ax && bx <= ay)
|| (by >= ax && by <= ay)








a0 this.low.pos
a1 this.high.pos
b0 obj.low.pos
b1 obj.high.pos



a0 <= b1 && b0 <= a1;
this.low.pos <= obj.high.pos && obj.low.pos <= this.high.pos;

obj.high.pos >= this.low.pos && this.high.pos >= obj.low.pos









b1h >= b2l && b2h >= b1l



b1l:10


- b2l: 30


- b2h: 50

b1h: 40



id:0 first { pos: 0 }



id:2 { pos: 10, dir: true, speed: 50 }

   id:3 { pos: 20, dir: true, speed: 5 }

id:4 { pos: 30, dir: true, speed: 5 }


id:1 last { pos: 100 }


b: id:2
p: id:4
pos: 20


One Dimension

IObject
{
	Up: IObject
	Down: IObject
	Pos: number
	Size: number
}
	
Array
{
	InitUp: IObject
	InitDown: IObject
	Objects: IObject[]
}

p2

p1

l2

l1



(p2 >= p1 && p2 <= l1) || (l2 >= p1 && l2 <= l1)



Two Dimension

IPos
{
	X: number
	Y: number
}

ISize
{
	Width: number
	Length: number
}

IItem<T>
{
	Back: T
	Next: T
	Pos: number
	Size: number
	SubArray: Nullable<IArray>
}

IArray<T, O> : where T extends IItem<O>
{
	InitBack: T
	InitNext: T
	Items: T[]
}

IObject
{
	Up: IObject
	Down: IObject
	Pos: IPos
	Size: ISize
}


// Uma array de controle para cada eixo, essa array de controle contem as arrays de items do eixo adjacente
// array de controle tem um inicio e fim, um comprimento

// quando dois itens intersectam nessa array, é criado uma array especial, que permite 


IField
{
	
}



// A array indica as posições ocupadas, e uma posição tem o ponteiro para a proxima



Tester

Field
AddObject
RemoveObject


Object
{
	P1: Point
	P2: Point
}

Point
{
	Back: Point
	Next: Point
	Pos: number
	Objects: Object[]
}

Array
{
	First: Point
	Last: Point	
	Points: Point[]
}

Field
{
	AxisX: Array
	MoveObject
		// ao mover o objeto em um eixo,
		// primeiro, checar se ha conflito direto naquele eixo
		// segundo, verificar
}

// Todo eixo tem uma array com todos pontos nesse eixo

// Todo objeto tem 




Segment {
	start: number;
	end: number;
	above: Segment;
	bellow: segment;
}

Array {
	entry: Segment;

	insert(nSeg: Segment): boolean {
		if (this.entry) {
			var seg = this.entry;
			while (seg) {
				if (nSeg.start >= seg.start && nSeg.end <= seg.end)
					return false;
				else if (nSeg.end < seg.start)
					if (seg.bellow)
						seg = seg.bellow;
					else {
						seg.bellow = nSeg;
						return true;
					}
				else
					if (seg.above) {
						if (nSeg.end < seg.above.start) {
							seg.above = nSeg;
							nSeg.above = seg.above;
							seg.above.bellow = nSeg;
							nSeg.bellow = seg;
						}
						else
							seg = seg.above;
					}
					else {
						seg.above = nSeg;
						nSeg.bellow = seg;
						return true;
					}
			}
		}
		else {
			this.entry = nSeg;
		}
	}

	find(v: number): Segment {
		var seg = this.entry;
		while (seg) {
			if (v >= seg.start && v <= seg.end)
				return seg;
			else if (v < seg.start)
				seg = seg.bellow;
			else
				seg = seg.above;
		}
		return null;
	}
}



seg0(50-70)
seg2(75-77)
seg1(80-100)


max = 100
