Kanoodle Fusion! Es un juego de rompecabezas de lógica desarrollado por Educational Insights, diseñado para niños, adolescentes y adultos a partir de 7 años. Es una versión colorida y única del clásico Kanoodle, con un tablero iluminado y piezas translúcidas que permiten mezclar colores primarios para crear colores secundarios, lo que añade un giro interesante al desafío.

¿Cómo se juega?

Componentes: Incluye un tablero de juego iluminado, 13 piezas de rompecabezas (10 translúcidas de colores y 3 neutras) y un libro con 50 desafíos.
Mecánica: Seleccionas un desafío del libro, colocas las piezas indicadas en el tablero y luego usas las piezas restantes para completar el rompecabezas. La clave está en apilar las piezas translúcidas para mezclar colores y formar los patrones requeridos.
Habilidades: Fomenta el pensamiento crítico, la resolución de problemas, la lógica, el razonamiento espacial y la comprensión de la teoría del color.


El modelo asume:
- El tablero es una matriz 2D rectangular de 4 x 4. Cada celda puede tener una pila (stack) de colores por apilamiento.
- Las piezas son formas polyomino-like (conectadas por "perlas" o celdas), con un color asociado.
- El mezclado de colores es subtractivo o aditivo simple (ej.: rojo + amarillo = naranja), implementado en una función.
- No hay restricciones estrictas de "no solapamiento" en el mismo nivel (ya que el apilamiento lo permite), pero el objetivo es matching la matriz de colores final.


el tablero tiene 4 x 4

las piezas son 

pieza1 = recta de 4 celdas azul  x
pieza2 = recta de 4 celdas roja x
pieza3 = recta de 4 celdas amarillo x
pieza4 = z de 4 celdas azul x
pieza5 = z de 4 celdas verde 
pieza6 = l de 4 celdas rojo x
pieza7 = codo de 3 celdas naranja x
pieza8 = recta de 3 celdas - 1 azul, 1 amarillo, 1 rojo x
pieza9 = recta de 3 celdas violeta x
pieza10 = t de 4 celdas color amarillo x
pieza11 = 1 celda neutra
pieza12 = 1 celda neutra
pieza13 = 1 celda neutra

las piezas pueden rotarse 0, 90, 180, 270
tambien pueden darse vuelta de una lado o de el otro 

no quiero usar enums utiliza u8 para representar los colores. 
para representar las coordenadas tambien 


los niveles son 50 que los quiero guardar en constantes. para saber si completo el nivel habria que comparar si la matriz de colores que esta armando es igual a la solucion de ese nivel.
