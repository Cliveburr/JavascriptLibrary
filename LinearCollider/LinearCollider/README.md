

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

