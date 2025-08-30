import { test, describe } from 'node:test'
import assert from 'node:assert'
import { toPascalCase, escapeStringForTypeScript } from './strings'

describe('toPascalCase', () => {
  test('converts kebab-case to PascalCase', () => {
    assert.strictEqual(toPascalCase('hello-world'), 'HelloWorld')
    assert.strictEqual(toPascalCase('rich-text-blocks'), 'RichTextBlocks')
  })

  test('converts snake_case to PascalCase', () => {
    assert.strictEqual(toPascalCase('hello_world'), 'HelloWorld')
    assert.strictEqual(toPascalCase('user_profile'), 'UserProfile')
  })

  test('converts space-separated to PascalCase', () => {
    assert.strictEqual(toPascalCase('hello world'), 'HelloWorld')
    assert.strictEqual(toPascalCase('my component'), 'MyComponent')
  })

  test('handles mixed separators', () => {
    assert.strictEqual(toPascalCase('hello-world_test case'), 'HelloWorldTestCase')
  })

  test('handles single words', () => {
    assert.strictEqual(toPascalCase('hello'), 'Hello')
    assert.strictEqual(toPascalCase('HELLO'), 'Hello')
  })

  test('handles empty string', () => {
    assert.strictEqual(toPascalCase(''), '')
  })
})

describe('escapeStringForTypeScript', () => {
  test('escapes single quotes', () => {
    assert.strictEqual(escapeStringForTypeScript("it's working"), "it\\'s working")
  })

  test('escapes backslashes', () => {
    assert.strictEqual(escapeStringForTypeScript('path\\to\\file'), 'path\\\\to\\\\file')
  })

  test('escapes newlines', () => {
    assert.strictEqual(escapeStringForTypeScript('line1\nline2'), 'line1\\nline2')
  })

  test('escapes carriage returns', () => {
    assert.strictEqual(escapeStringForTypeScript('line1\rline2'), 'line1\\rline2')
  })

  test('escapes tabs', () => {
    assert.strictEqual(escapeStringForTypeScript('col1\tcol2'), 'col1\\tcol2')
  })

  test('handles non-string input', () => {
    assert.strictEqual(escapeStringForTypeScript(123), '123')
    assert.strictEqual(escapeStringForTypeScript(null), 'null')
    assert.strictEqual(escapeStringForTypeScript(undefined), 'undefined')
  })

  test('handles complex strings', () => {
    const input = "Hello 'world'\nWith\\backslash\tand\ttabs"
    const expected = "Hello \\'world\\'\\nWith\\\\backslash\\tand\\ttabs"
    assert.strictEqual(escapeStringForTypeScript(input), expected)
  })
})
