import {Scanner, Character} from "../../src/Lexer/Scanner";

test("Default", () => {
    let source = "123";
    let result = [
        new Character("1", 0, 0, 0),
        new Character("2", 1, 1, 0),
        new Character("3", 2, 2, 0),
        new Character("\0", 3, 3, 0),
        new Character("\0", 3, 3, 0)
    ]
    let scanner = new Scanner(source);
    result.forEach((res) => {
        const ch = scanner.get();
        expect(JSON.stringify(ch)).toBe(JSON.stringify(res));
    })
});

test("Multiline", () => {
    let source = "1\n3\n5";
    let result = [
        new Character("1", 0, 0, 0),
        new Character("\n", 1, 1, 0),
        new Character("3", 2, 0, 1),
        new Character("\n", 3, 1, 1),
        new Character("5", 4, 0, 2),
        new Character("\0", 5, 1, 2),
        new Character("\0", 5, 1, 2)
    ]
    let scanner = new Scanner(source);
    result.forEach((res) => {
        const ch = scanner.get();
        expect(JSON.stringify(ch)).toBe(JSON.stringify(res));
    })
});

test("Multiline with spaces", () => {
    let source = "1 \n 3\n5";
    let result = [
        new Character("1", 0, 0, 0),
        new Character(" ", 1, 1, 0),
        new Character("\n", 2, 2, 0),
        new Character(" ", 3, 0, 1),
        new Character("3", 4, 1, 1),
        new Character("\n", 5, 2, 1),
        new Character("5", 6, 0, 2),
        new Character("\0", 7, 1, 2),
        new Character("\0", 7, 1, 2)
    ]
    let scanner = new Scanner(source);
    result.forEach((res) => {
        const ch = scanner.get();
        expect(JSON.stringify(ch)).toBe(JSON.stringify(res));
    })
});