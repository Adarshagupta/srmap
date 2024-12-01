#include <stdio.h>
#include <string.h>

void appendToFile() {
    FILE *fp;
    char text[100];
    fp = fopen("students.txt", "a");
    if (fp == NULL) {
        printf("Error opening file!\n");
        return;
    }
    printf("Enter text to append to file: ");
    fgets(text, sizeof(text), stdin);
    fprintf(fp, "%s", text);
    fclose(fp);
    printf("Text successfully appended!\n");
}
void readFile() {
    FILE *fp;
    char text[100];
    fp = fopen("students.txt", "r");
    if (fp == NULL) {
        printf("Error opening file for reading!\n");
        return;
    }
    printf("\nContents of file:\n");
    printf("------------------------\n");
    while (fgets(text, sizeof(text), fp)) {
        printf("%s", text);
    }
    printf("------------------------\n");
    fclose(fp);
}

int main() {
    int choice;

    do {
        printf("\n1. Append text to file\n");
        printf("2. Read file contents\n");
        printf("3. Exit\n");
        printf("Enter your choice (1-3): ");
        scanf("%d", &choice);
        getchar();
        
        switch(choice) {
            case 1:
                appendToFile();
                break;
            case 2:
                readFile();
                break;
            case 3:
                printf("Exiting program...\n");
                break;
            default:
                printf("Invalid choice! Please try again.\n");
        }
    } while(choice != 3);

    return 0;
}