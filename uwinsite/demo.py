#include <stdio.h>

int main() {
	int a,b,c,x;
	printf("input a, b, c, x in order:\n");
	scanf("%d%d%d%d", &a, &b, &c, &x);
	if(x > 40000) {
		printf("x too big!\n");
		return 1;
	}
	printf("%d(%d)^2 + %d(%d) + %d = %d\n", a, x, b, x, c, a*x*x + b*x + c);
}
