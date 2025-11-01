Kanoodle fusion

colors::BLUE=azul
colors::RED=rojo
colors::YELLOW=amarillo
colors::GREEN=verde
colors::ORANGE=naranja
colors::PURPLE=violeta

piezas

las piezas piece::ID_1, piece::ID_2 colors::YELLOW piece::ID_3 son aquellas que ocupan 4 celdas, si son diferentes significa que es la de tipo 2, los demás colores tienen una sola pieza así que todas terminan en 1, ejemplo: piece::ID_9, piece::ID_7.
 
azules= piece::ID_1, piece::ID_4
rojas= piece::ID_2, piece::ID_6
amarillas= piece::ID_3, piece::ID_10
verde= piece::ID_5
naranjas= piece::ID_7
violetas= piece::ID_9
multicolor= piece::ID_8
obstáculos= piece::ID_11, piece::ID_12, piece::ID_13



level 1

piezas:
piece::ID_1, piece::ID_4, piece::ID_2, piece::ID_6, piece::ID_11, piece::ID_12, piece::ID_13

[colors::RED, colors::BLUE, colors::BLUE, colors::NEUTRAL]
[colors::RED, colors::RED, colors::PURPLE, colors::BLUE]
[colors::RED, colors::RED, colors::NEUTRAL, colors::NEUTRAL]
[colors::PURPLE, colors::PURPLE, colors::BLUE, colors::BLUE]


level 2

piezas: 
piece::ID_1, piece::ID_4, piece::ID_2, piece::ID_6, piece::ID_11, piece::ID_12 

[colors::RED, colors::RED, colors::RED, colors::BLUE]
[colors::RED, colors::BLUE, colors::RED, colors::BLUE]
[colors::RED, colors::BLUE, colors::PURPLE, colors::BLUE]
[colors::NEUTRAL, colors::NEUTRAL, colors::PURPLE, colors::BLUE]

level 3

piezas:
piece::ID_2, piece::ID_6, piece::ID_3, piece::ID_10, piece::ID_11, piece::ID_12

[colors::RED, colors::RED, colors::RED, colors::YELLOW]
[colors::RED, colors::RED, colors::RED, colors::ORANGE]
[colors::NEUTRAL, colors::YELLOW, colors::NEUTRAL, colors::YELLOW]
[colors::YELLOW, colors::YELLOW, colors::YELLOW, colors::YELLOW]

level 4

piezas
piece::ID_1, piece::ID_4, piece::ID_6, piece::ID_3, piece::ID_11

[colors::BLUE, colors::GREEN, colors::BLUE, colors::BLUE]
[colors::RED, colors::YELLOW, colors::YELLOW, colors::BLUE]
[colors::RED, colors::YELLOW, colors::YELLOW, colors::BLUE]
[colors::RED, colors::RED, colors::BLUE, colors::NEUTRAL]

level 5 

piezas:
piece::ID_2, piece::ID_6, piece::ID_3, piece::ID_10, piece::ID_11, piece::ID_12, piece::ID_13

[colors::YELLOW, colors::NEUTRAL, colors::NEUTRAL, colors::RED]
[colors::YELLOW, colors::ORANGE, colors::RED, colors::RED]
[colors::YELLOW, colors::NEUTRAL, colors::RED, colors::RED]
[colors::YELLOW, colors::YELLOW, colors::ORANGE, colors::ORANGE]

level 6

piezas:
piece::ID_1, piece::ID_4, piece::ID_2, piece::ID_3, piece::ID_11, piece::ID_12
 
[colors::BLUE, colors::BLUE, colors::BLUE, colors::BLUE]
[colors::RED, colors::PURPLE, colors::RED, colors::RED]
[colors::BLUE, colors::BLUE, colors::NEUTRAL, colors::NEUTRAL]
[colors::GREEN, colors::YELLOW, colors::YELLOW, colors::YELLOW]

level 7

piezas:
piece::ID_1, piece::ID_4, piece::ID_6, piece::ID_10, piece::ID_11, piece::ID_12

[colors::NEUTRAL, colors::BLUE, colors::YELLOW, colors::NEUTRAL]
[colors::BLUE, colors::BLUE, colors::YELLOW, colors::YELLOW]
[colors::BLUE, colors::RED, colors::ORANGE, colors::RED]
[colors::BLUE, colors::PURPLE, colors::BLUE, colors::BLUE]

level 8

piezas
piece::ID_1, piece::ID_4, piece::ID_2, piece::ID_10, piece::ID_11, piece::ID_12, piece::ID_13

[colors::BLUE, colors::GREEN, colors::BLUE, colors::RED]
[colors::BLUE, colors::YELLOW, colors::GREEN, colors::PURPLE]
[colors::BLUE, colors::YELLOW, colors::NEUTRAL, colors::RED]
[colors::BLUE, colors::NEUTRAL, colors::NEUTRAL, colors::RED]

level 9

piezas
piece::ID_4, piece::ID_2, piece::ID_6, piece::ID_3, piece::ID_11, piece::ID_12

[colors::NEUTRAL, colors::BLUE, colors::PURPLE, colors::RED]
[colors::BLUE, colors::BLUE, colors::NEUTRAL, colors::RED]
[colors::YELLOW, colors::YELLOW, colors::YELLOW, colors::ORANGE]
[colors::RED, colors::RED, colors::RED, colors::RED]

level 10

piezas
piece::ID_1, piece::ID_4, piece::ID_6, piece::ID_3, piece::ID_11, piece::ID_12

[colors::BLUE, colors::NEUTRAL, colors::RED, colors::PURPLE]
[colors::BLUE, colors::BLUE, colors::RED, colors::BLUE]
[colors::NEUTRAL, colors::BLUE, colors::RED, colors::BLUE]
[colors::YELLOW, colors::YELLOW, colors::YELLOW, colors::GREEN]

level 11

piezas
piece::ID_1, piece::ID_2, piece::ID_6, piece::ID_10, piece::ID_11, piece::ID_12, piece::ID_13

[colors::NEUTRAL, colors::YELLOW, colors::YELLOW, colors::ORANGE]
[colors::NEUTRAL, colors::NEUTRAL, colors::YELLOW, colors::RED]
[colors::PURPLE, colors::BLUE, colors::BLUE, colors::PURPLE]
[colors::RED, colors::RED, colors::RED, colors::RED]

level 12

piezas
piece::ID_1, piece::ID_2, piece::ID_6, piece::ID_10, piece::ID_11, piece::ID_12

[colors::NEUTRAL, colors::YELLOW, colors::NEUTRAL, colors::RED]
[colors::YELLOW, colors::YELLOW, colors::ORANGE, colors::RED]
[colors::RED, colors::RED, colors::RED, colors::RED]
[colors::BLUE, colors::BLUE, colors::BLUE, colors::PURPLE]

level 13

piezas
piece::ID_1, piece::ID_2, piece::ID_6, piece::ID_3, piece::ID_10, piece::ID_11, piece::ID_12, piece::ID_13

[colors::RED, colors::PURPLE, colors::RED, colors::ORANGE]
[colors::RED, colors::BLUE, colors::YELLOW, colors::ORANGE]
[colors::NEUTRAL, colors::BLUE, colors::NEUTRAL, colors::ORANGE]
[colors::YELLOW, colors::GREEN, colors::YELLOW, colors::ORANGE]

level 14

piezas
piece::ID_4, piece::ID_6, piece::ID_3, piece::ID_10, piece::ID_11, piece::ID_12, piece::ID_13

[colors::NEUTRAL, colors::YELLOW, colors::BLUE, colors::NEUTRAL]
[colors::RED, colors::ORANGE, colors::GREEN, colors::BLUE]
[colors::RED, colors::YELLOW, colors::NEUTRAL, colors::BLUE]
[colors::ORANGE, colors::YELLOW, colors::YELLOW, colors::YELLOW]

level 15

piezas
piece::ID_4, piece::ID_2, piece::ID_6, piece::ID_3, piece::ID_10

[colors::RED, colors::YELLOW, colors::RED, colors::RED]
[colors::RED, colors::GREEN, colors::GREEN, colors::RED]
[colors::RED, colors::YELLOW, colors::BLUE, colors::PURPLE]
[colors::ORANGE, colors::YELLOW, colors::YELLOW, colors::YELLOW]

level 16

piezas
piece::ID_1, piece::ID_4, piece::ID_2, piece::ID_6, piece::ID_10, piece::ID_11

[colors::YELLOW, colors::BLUE, colors::RED, colors::RED]
[colors::YELLOW, colors::GREEN, colors::RED, colors::RED]
[colors::YELLOW, colors::BLUE, colors::PURPLE, colors::RED]
[colors::BLUE, colors::BLUE, colors::RED, colors::NEUTRAL]

level 17

piezas
piece::ID_1, piece::ID_4, piece::ID_6, piece::ID_3, piece::ID_10, piece::ID_11, piece::ID_12

[colors::NEUTRAL, colors::PURPLE, colors::RED, colors::ORANGE]
[colors::YELLOW, colors::PURPLE, colors::NEUTRAL, colors::YELLOW]
[colors::YELLOW, colors::GREEN, colors::BLUE, colors::GREEN]
[colors::YELLOW, colors::BLUE, colors::BLUE, colors::YELLOW]

level 18

piezas
piece::ID_1, piece::ID_4, piece::ID_2, piece::ID_6, piece::ID_3, piece::ID_10

[colors::PURPLE, colors::GREEN, colors::RED, colors::RED]
[colors::RED, colors::GREEN, colors::BLUE, colors::ORANGE]
[colors::RED, colors::YELLOW, colors::YELLOW, colors::ORANGE]
[colors::PURPLE, colors::GREEN, colors::BLUE, colors::GREEN]

level 19

piezas
piece::ID_4, piece::ID_3, piece::ID_10, piece::ID_5, piece::ID_11, piece::ID_12, piece::ID_13

[colors::NEUTRAL, colors::NEUTRAL, colors::GREEN, colors::NEUTRAL]
[colors::BLUE, colors::GREEN, colors::GREEN, colors::GREEN]
[colors::YELLOW, colors::GREEN, colors::BLUE, colors::GREEN]
[colors::YELLOW, colors::YELLOW, colors::YELLOW, colors::YELLOW]

level 20

piezas
piece::ID_1, piece::ID_4, piece::ID_3, piece::ID_10, piece::ID_5, piece::ID_11, piece::ID_12, piece::ID_13

[colors::NEUTRAL, colors::GREEN, colors::GREEN, colors::NEUTRAL]
[colors::GREEN, colors::GREEN, colors::GREEN, colors::GREEN]
[colors::BLUE, colors::YELLOW, colors::NEUTRAL, colors::GREEN]
[colors::GREEN, colors::GREEN, colors::GREEN, colors::GREEN]

level 21

piezas
piece::ID_2, piece::ID_6, piece::ID_3, piece::ID_7, piece::ID_11, piece::ID_12, piece::ID_13

[colors::YELLOW, colors::NEUTRAL, colors::NEUTRAL, colors::RED]
[colors::YELLOW, colors::ORANGE, colors::ORANGE, colors::RED]
[colors::ORANGE, colors::ORANGE, colors::NEUTRAL, colors::RED]
[colors::ORANGE, colors::RED, colors::RED, colors::RED]

level 22

piezas
piece::ID_2, piece::ID_6, piece::ID_3, piece::ID_10, piece::ID_7, piece::ID_11, piece::ID_12

[colors::ORANGE, colors::ORANGE, colors::ORANGE, colors::NEUTRAL]
[colors::RED, colors::ORANGE, colors::ORANGE, colors::NEUTRAL]
[colors::RED, colors::RED, colors::ORANGE, colors::ORANGE]
[colors::ORANGE, colors::YELLOW, colors::YELLOW, colors::YELLOW]

level 23

piezas
piece::ID_1, piece::ID_4, piece::ID_6, piece::ID_9, piece::ID_11, piece::ID_12, piece::ID_13

[colors::NEUTRAL, colors::BLUE, colors::BLUE, colors::NEUTRAL]
[colors::RED, colors::RED, colors::PURPLE, colors::BLUE]
[colors::BLUE, colors::BLUE, colors::PURPLE, colors::BLUE]
[colors::NEUTRAL, colors::PURPLE, colors::PURPLE, colors::PURPLE]

level 24

piezas
piece::ID_1, piece::ID_4, piece::ID_2, piece::ID_6, piece::ID_9

[colors::RED, colors::BLUE, colors::RED, colors::PURPLE]
[colors::PURPLE, colors::BLUE, colors::RED, colors::PURPLE]
[colors::PURPLE, colors::RED, colors::RED, colors::PURPLE]
[colors::PURPLE, colors::BLUE, colors::BLUE, colors::BLUE]

level 25

piezas
piece::ID_4, piece::ID_6, piece::ID_3, piece::ID_7, piece::ID_9, piece::ID_11, piece::ID_12

[colors::NEUTRAL, colors::YELLOW, colors::NEUTRAL, colors::BLUE]
[colors::PURPLE, colors::ORANGE, colors::PURPLE, colors::PURPLE]
[colors::PURPLE, colors::ORANGE, colors::BLUE, colors::ORANGE]
[colors::PURPLE, colors::YELLOW, colors::ORANGE, colors::ORANGE]

level 26

piezas
piece::ID_1, piece::ID_6, y3, piece::ID_7, piece::ID_9, piece::ID_11, piece::ID_12

[colors::BLUE, colors::PURPLE, colors::PURPLE, colors::PURPLE]
[colors::PURPLE, colors::YELLOW, colors::YELLOW, colors::ORANGE]
[colors::PURPLE, colors::NEUTRAL, colors::YELLOW, colors::ORANGE]
[colors::PURPLE, colors::NEUTRAL, colors::ORANGE, colors::ORANGE]

level 27

piezas
piece::ID_4, piece::ID_6, piece::ID_10, piece::ID_5, piece::ID_7, piece::ID_11

[colors::RED, colors::ORANGE, colors::GREEN, colors::GREEN]
[colors::RED, colors::BLUE, colors::GREEN, colors::NEUTRAL]
[colors::RED, colors::GREEN, colors::GREEN, colors::ORANGE]
[colors::GREEN, colors::GREEN, colors::ORANGE, colors::ORANGE]

level 28

piezas
piece::ID_1, piece::ID_6, piece::ID_10, piece::ID_5, piece::ID_7, piece::ID_11

[colors::RED, colors::GREEN, colors::ORANGE, colors::ORANGE]
[colors::ORANGE, colors::GREEN, colors::GREEN, colors::ORANGE]
[colors::ORANGE, colors::ORANGE, colors::GREEN, colors::NEUTRAL]
[colors::GREEN, colors::BLUE, colors::BLUE, colors::BLUE]

level 29

piezas
piece::ID_4, piece::ID_6, piece::ID_10, piece::ID_5, v2, piece::ID_11

[colors::PURPLE, colors::YELLOW, colors::GREEN, colors::YELLOW]
[colors::PURPLE, colors::NEUTRAL, colors::GREEN, colors::PURPLE]
[colors::PURPLE, colors::GREEN, colors::GREEN, colors::PURPLE]
[colors::GREEN, colors::GREEN, colors::RED, colors::RED]

level 30

piezas
piece::ID_1, piece::ID_6, piece::ID_10, piece::ID_5, piece::ID_9, piece::ID_11

[colors::PURPLE, colors::PURPLE, colors::PURPLE, colors::GREEN]
[colors::RED, colors::GREEN, colors::YELLOW, colors::YELLOW]
[colors::GREEN, colors::GREEN, colors::NEUTRAL, colors::YELLOW]
[colors::GREEN, colors::PURPLE, colors::PURPLE, colors::PURPLE]

level 31

piezas
piece::ID_1, piece::ID_4, piece::ID_2, piece::ID_6, piece::ID_3, piece::ID_10, piece::ID_7

[colors::PURPLE, colors::ORANGE, colors::ORANGE, colors::GREEN]
[colors::PURPLE, colors::ORANGE, colors::GREEN, colors::GREEN]
[colors::PURPLE, colors::ORANGE, colors::GREEN, colors::YELLOW]
[colors::YELLOW, colors::RED, colors::ORANGE, colors::ORANGE]

level 32

piezas
piece::ID_1, piece::ID_2, piece::ID_6, piece::ID_10, piece::ID_7, piece::ID_9, piece::ID_11

[colors::YELLOW, colors::NEUTRAL, colors::ORANGE, colors::ORANGE]
[colors::ORANGE, colors::ORANGE, colors::RED, colors::ORANGE]
[colors::ORANGE, colors::PURPLE, colors::PURPLE, colors::PURPLE]
[colors::PURPLE, colors::PURPLE, colors::PURPLE, colors::PURPLE]

level 33

piezas
piece::ID_4, piece::ID_2, piece::ID_6, piece::ID_3, piece::ID_10, piece::ID_7, piece::ID_11

[colors::ORANGE, colors::BLUE, colors::BLUE, colors::NEUTRAL]
[colors::ORANGE, colors::ORANGE, colors::GREEN, colors::BLUE]
[colors::ORANGE, colors::YELLOW, colors::YELLOW, colors::YELLOW]
[colors::RED, colors::RED, colors::RED, colors::RED]

level 34

piezas
piece::ID_1, piece::ID_4, piece::ID_2, piece::ID_6, piece::ID_10, piece::ID_9

[colors::PURPLE, colors::YELLOW, colors::BLUE, colors::RED]
[colors::PURPLE, colors::YELLOW, colors::GREEN, colors::PURPLE]
[colors::PURPLE, colors::YELLOW, colors::RED, colors::PURPLE]
[colors::PURPLE, colors::PURPLE, colors::PURPLE, colors::PURPLE]

level 35

piezas
piece::ID_2, piece::ID_6, piece::ID_3, piece::ID_10, piece::ID_7, piece::ID_9, piece::ID_11

[colors::ORANGE, colors::ORANGE, colors::ORANGE, colors::ORANGE]
[colors::RED, colors::YELLOW, colors::ORANGE, colors::ORANGE]
[colors::NEUTRAL, colors::ORANGE, colors::ORANGE, colors::ORANGE]
[colors::PURPLE, colors::PURPLE, colors::PURPLE, colors::ORANGE]

level 36

piezas
piece::ID_1, piece::ID_4, piece::ID_3, piece::ID_10, piece::ID_5, piece::ID_11, piece::ID_12

[colors::BLUE, colors::NEUTRAL, colors::GREEN, colors::NEUTRAL]
[colors::BLUE, colors::GREEN, colors::GREEN, colors::GREEN]
[colors::GREEN, colors::GREEN, colors::GREEN, colors::GREEN]
[colors::GREEN, colors::YELLOW, colors::GREEN, colors::YELLOW]

level 37

piece::ID_1, piece::ID_4, piece::ID_2, piece::ID_6, piece::ID_7, piece::ID_9, piece::ID_11
[colors::BLUE, colors::PURPLE, colors::PURPLE, colors::PURPLE]
[colors::PURPLE, colors::NEUTRAL, colors::PURPLE, colors::RED]
[colors::PURPLE, colors::ORANGE, colors::PURPLE, colors::PURPLE]
[colors::PURPLE, colors::ORANGE, colors::ORANGE, colors::PURPLE]

level 38

piezas
piece::ID_4, piece::ID_2, piece::ID_6, piece::ID_10, piece::ID_8

[colors::BLUE, colors::GREEN, colors::BLUE, colors::RED]
[colors::YELLOW, colors::GREEN, colors::GREEN, colors::RED]
[colors::RED, colors::YELLOW, colors::RED, colors::RED]
[colors::RED, colors::RED, colors::RED, colors::RED]

level 39

piece::ID_4, piece::ID_2, piece::ID_6, piece::ID_10, piece::ID_8, piece::ID_11
[colors::NEUTRAL, colors::BLUE, colors::PURPLE, colors::RED]
[colors::GREEN, colors::BLUE, colors::YELLOW, colors::RED]
[colors::GREEN, colors::YELLOW, colors::RED, colors::RED]
[colors::ORANGE, colors::RED, colors::RED, colors::RED]

level 40

piezas
piece::ID_1, piece::ID_4, piece::ID_2, piece::ID_6, piece::ID_3, piece::ID_10, piece::ID_8

[colors::PURPLE, colors::BLUE, colors::BLUE, colors::GREEN]
[colors::ORANGE, colors::BLUE, colors::GREEN, colors::ORANGE]
[colors::ORANGE, colors::GREEN, colors::BLUE, colors::ORANGE]
[colors::ORANGE, colors::PURPLE, colors::RED, colors::ORANGE]

level 41

piezas
piece::ID_1, piece::ID_4, piece::ID_2, piece::ID_6, piece::ID_3, piece::ID_10, piece::ID_8

[colors::RED, colors::RED, colors::ORANGE, colors::PURPLE]
[colors::RED, colors::RED, colors::RED, colors::YELLOW]
[colors::BLUE, colors::BLUE, colors::GREEN, colors::GREEN]
[colors::YELLOW, colors::PURPLE, colors::PURPLE, colors::YELLOW]

level 42

piezas
piece::ID_2, piece::ID_6, piece::ID_3, piece::ID_10, piece::ID_7, piece::ID_8

[colors::YELLOW, colors::ORANGE, colors::ORANGE, colors::YELLOW]
[colors::ORANGE, colors::YELLOW, colors::ORANGE, colors::YELLOW]
[colors::ORANGE, colors::BLUE, colors::YELLOW, colors::ORANGE]
[colors::RED, colors::RED, colors::RED, colors::ORANGE]

level 43

piezas
piece::ID_4, piece::ID_2, piece::ID_6, piece::ID_3, piece::ID_10, piece::ID_8, piece::ID_11

[colors::ORANGE, colors::ORANGE, colors::ORANGE, colors::ORANGE]
[colors::RED, colors::YELLOW, colors::GREEN, colors::NEUTRAL]
[colors::RED, colors::GREEN, colors::GREEN, colors::YELLOW]
[colors::RED, colors::RED, colors::PURPLE, colors::BLUE]

level 44

piezas
piece::ID_4, piece::ID_6, piece::ID_3, piece::ID_10, piece::ID_5, piece::ID_8

[colors::GREEN, colors::BLUE, colors::YELLOW, colors::RED]
[colors::ORANGE, colors::GREEN, colors::GREEN, colors::YELLOW]
[colors::ORANGE, colors::GREEN, colors::GREEN, colors::BLUE]
[colors::ORANGE, colors::RED, colors::GREEN, colors::GREEN]

level 45

piezas
piece::ID_1, piece::ID_4, piece::ID_6, piece::ID_3, piece::ID_10, piece::ID_9, piece::ID_8

[colors::PURPLE, colors::ORANGE, colors::BLUE, colors::BLUE]
[colors::PURPLE, colors::GREEN, colors::PURPLE, colors::PURPLE]
[colors::PURPLE, colors::YELLOW, colors::YELLOW, colors::PURPLE]
[colors::GREEN, colors::YELLOW, colors::GREEN, colors::PURPLE]

level 46

piezas 
piece::ID_1, piece::ID_4, piece::ID_2, piece::ID_6, piece::ID_10, piece::ID_9, piece::ID_8, piece::ID_12

[colors::PURPLE, colors::NEUTRAL, colors::PURPLE, colors::PURPLE]
[colors::GREEN, colors::BLUE, colors::PURPLE, colors::PURPLE]
[colors::PURPLE, colors::GREEN, colors::PURPLE, colors::PURPLE]
[colors::ORANGE, colors::ORANGE, colors::ORANGE, colors::PURPLE]

level 47

piezas
piece::ID_1, piece::ID_4, piece::ID_6, piece::ID_10, piece::ID_9, piece::ID_8, piece::ID_11

[colors::PURPLE, colors::PURPLE, colors::PURPLE, colors::BLUE]
[colors::PURPLE, colors::RED, colors::ORANGE, colors::BLUE]
[colors::PURPLE, colors::GREEN, colors::GREEN, colors::YELLOW]
[colors::PURPLE, colors::NEUTRAL, colors::GREEN, colors::BLUE]

level 48

piezas
piece::ID_4, piece::ID_2, piece::ID_6, piece::ID_7, piece::ID_9, piece::ID_8

[colors::PURPLE, colors::BLUE, colors::PURPLE, colors::RED]
[colors::PURPLE, colors::ORANGE, colors::BLUE, colors::PURPLE]
[colors::PURPLE, colors::ORANGE, colors::ORANGE, colors::RED]
[colors::PURPLE, colors::ORANGE, colors::RED, colors::RED]

level 49

piezas
piece::ID_1, piece::ID_2, piece::ID_6, piece::ID_3, piece::ID_10, piece::ID_7, piece::ID_8

[colors::ORANGE, colors::ORANGE, colors::ORANGE, colors::BLUE]
[colors::ORANGE, colors::ORANGE, colors::ORANGE, colors::BLUE]
[colors::ORANGE, colors::RED, colors::YELLOW, colors::BLUE]
[colors::ORANGE, colors::ORANGE, colors::ORANGE, colors::GREEN]

level 50

piezas
piece::ID_1, piece::ID_4, piece::ID_2, piece::ID_6, piece::ID_3, piece::ID_10, piece::ID_8,   

[colors::RED, colors::RED, colors::BLUE, colors::BLUE]
[colors::PURPLE, colors::BLUE, colors::BLUE, colors::BLUE]
[colors::ORANGE, colors::YELLOW, colors::YELLOW, colors::YELLOW]
[colors::ORANGE, colors::ORANGE, colors::ORANGE, colors::RED]