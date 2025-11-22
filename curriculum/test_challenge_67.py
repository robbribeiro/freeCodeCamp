#!/usr/bin/env python3
"""
Teste para demonstrar a correção no validador de email (Challenge 67)
Este teste deve PASSAR (GREEN) porque a validação de dois pontos consecutivos foi implementada
"""

from unittest import TestCase
import re

# Código CORRIGIDO 
def validate(email):
    if '..' in email:
        return False

    parts = email.split('@')
    if len(parts) != 2:
        return False

    local, domain = parts

    if local.startswith('.') or local.endswith('.'):
        return False
    if not re.match(r'^[a-zA-Z0-9._-]+$', local):
        return False

    if '.' not in domain:
        return False

    tld = domain.split('.')[-1]
    if len(tld) < 2 or not tld.isalpha():
        return False

    return True

print("=" * 70)
print("TESTE: validate('develop..ment_user@c0D!NG.R.CKS') should return False")
print("=" * 70)
print()

email = "develop..ment_user@c0D!NG.R.CKS"
result = validate(email)

print(f"Email testado: {email}")
print(f"Resultado obtido: {result}")
print(f"Tipo do resultado: {type(result).__name__}")
print()

print("Executando: TestCase().assertIs(result, False)")
print("-" * 70)

try:
    TestCase().assertIs(result, False)
    print("✓ TESTE PASSOU (GREEN - como esperado!)")
    print()
    print("=" * 70)
    print("SUCESSO! A correção funcionou!")
    print("O código agora rejeita corretamente emails com dois pontos consecutivos")
    print("=" * 70)
except AssertionError as e:
    print("✗ TESTE FALHOU")
    print()
    print("ERRO:")
    print(str(e))
    print()
    print("=" * 70)
    print("A correção não funcionou como esperado")
    print("=" * 70)

