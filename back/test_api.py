#!/usr/bin/env python
"""
Script de teste da API
Execute: python test_api.py
"""

import requests
import json
from datetime import datetime, timedelta

BASE_URL = "http://localhost:8000/api/v1"

# Cores para output
class Colors:
    GREEN = '\033[92m'
    RED = '\033[91m'
    YELLOW = '\033[93m'
    BLUE = '\033[94m'
    RESET = '\033[0m'

# Tokens globais
access_token = None
user_data = None

def print_section(title):
    print(f"\n{Colors.BLUE}{'='*60}")
    print(f"  {title}")
    print(f"{'='*60}{Colors.RESET}\n")

def print_success(msg):
    print(f"{Colors.GREEN}✓ {msg}{Colors.RESET}")

def print_error(msg):
    print(f"{Colors.RED}✗ {msg}{Colors.RESET}")

def print_info(msg):
    print(f"{Colors.YELLOW}ℹ {msg}{Colors.RESET}")

# Headers com token
def get_headers():
    headers = {"Content-Type": "application/json"}
    if access_token:
        headers["Authorization"] = f"Bearer {access_token}"
    return headers

# ============================================
# TESTES
# ============================================

def test_register():
    print_section("1. Teste: Registrar Novo Usuário")
    
    payload = {
        "email": f"test{datetime.now().timestamp():.0f}@example.com",
        "username": f"testuser{datetime.now().timestamp():.0f}",
        "password": "testpass123456",
        "password2": "testpass123456",
        "first_name": "Test",
        "last_name": "User"
    }
    
    response = requests.post(f"{BASE_URL}/auth/register/", json=payload)
    
    if response.status_code == 201:
        data = response.json()
        global access_token, user_data
        access_token = data["access"]
        user_data = data["user"]
        
        print_success(f"Usuário criado: {user_data['email']}")
        print_info(f"Token obtido: {access_token[:20]}...")
        return True
    else:
        print_error(f"Erro ao registrar: {response.status_code}")
        print_error(response.text)
        return False

def test_login():
    print_section("2. Teste: Login")
    
    if not user_data:
        print_error("Nenhum usuário registrado ainda!")
        return False
    
    payload = {
        "email": user_data["email"],
        "password": "testpass123456"
    }
    
    response = requests.post(f"{BASE_URL}/auth/login/", json=payload)
    
    if response.status_code == 200:
        data = response.json()
        global access_token
        access_token = data["access"]
        print_success(f"Login bem-sucedido para {user_data['email']}")
        print_info(f"Novo token obtido: {access_token[:20]}...")
        return True
    else:
        print_error(f"Erro ao fazer login: {response.status_code}")
        print_error(response.text)
        return False

def test_get_profile():
    print_section("3. Teste: Obter Perfil Atual")
    
    if not access_token:
        print_error("Nenhum token disponível!")
        return False
    
    response = requests.get(f"{BASE_URL}/auth/me/", headers=get_headers())
    
    if response.status_code == 200:
        data = response.json()
        print_success(f"Perfil obtido:")
        print(json.dumps(data, indent=2, ensure_ascii=False))
        return True
    else:
        print_error(f"Erro ao obter perfil: {response.status_code}")
        print_error(response.text)
        return False

def test_create_property():
    print_section("4. Teste: Criar Propriedade")
    
    if not access_token:
        print_error("Nenhum token disponível!")
        return False
    
    payload = {
        "title": f"Apartamento Teste {datetime.now().timestamp():.0f}",
        "description": "Um apartamento de teste para validar a API",
        "property_type": "apartment",
        "address": "Rua das Flores, 123",
        "city": "São Paulo",
        "state": "SP",
        "zip_code": "01234-567",
        "latitude": -23.5505,
        "longitude": -46.6333,
        "price": "250000.00",
        "area": 95.5,
        "bedrooms": 2,
        "bathrooms": 1,
        "status": "available"
    }
    
    response = requests.post(f"{BASE_URL}/properties/", json=payload, headers=get_headers())
    
    if response.status_code == 201:
        data = response.json()
        global property_id
        property_id = data["id"]
        print_success(f"Propriedade criada com ID: {property_id}")
        print_info(f"Título: {data['title']}")
        print_info(f"Preço: R$ {data['price']}")
        return True
    else:
        print_error(f"Erro ao criar propriedade: {response.status_code}")
        print_error(response.text)
        return False

def test_list_properties():
    print_section("5. Teste: Listar Propriedades")
    
    response = requests.get(f"{BASE_URL}/properties/", headers=get_headers())
    
    if response.status_code == 200:
        data = response.json()
        count = data.get("count", 0)
        results = data.get("results", [])
        
        print_success(f"Total de propriedades: {count}")
        print_info(f"Propriedades nesta página: {len(results)}")
        
        if results:
            print_info("Primeira propriedade:")
            print(f"  - Título: {results[0]['title']}")
            print(f"  - Cidade: {results[0]['city']}")
            print(f"  - Preço: R$ {results[0]['price']}")
        
        return True
    else:
        print_error(f"Erro ao listar propriedades: {response.status_code}")
        print_error(response.text)
        return False

def test_get_property_details():
    print_section("6. Teste: Obter Detalhes da Propriedade")
    
    if property_id is None:
        print_error("Nenhuma propriedade criada ainda!")
        return False
    
    response = requests.get(f"{BASE_URL}/properties/{property_id}/", headers=get_headers())
    
    if response.status_code == 200:
        data = response.json()
        print_success(f"Detalhes da propriedade obtidos:")
        print(json.dumps(data, indent=2, ensure_ascii=False))
        return True
    else:
        print_error(f"Erro ao obter detalhes: {response.status_code}")
        print_error(response.text)
        return False

def test_create_booking():
    print_section("7. Teste: Criar Agendamento")
    
    if not access_token or property_id is None:
        print_error("Token ou ID de propriedade não disponíveis!")
        return False
    
    start_date = datetime.now() + timedelta(days=7)
    end_date = start_date + timedelta(days=3)
    
    payload = {
        "property": property_id,
        "start_date": start_date.strftime("%Y-%m-%d"),
        "end_date": end_date.strftime("%Y-%m-%d"),
        "is_monthly_rental": False,
        "message": "Gostaria de agendar uma visita para esta propriedade"
    }
    
    response = requests.post(f"{BASE_URL}/bookings/", json=payload, headers=get_headers())
    
    if response.status_code == 201:
        data = response.json()
        global booking_id
        booking_id = data["id"]
        print_success(f"Agendamento criado com ID: {booking_id}")
        print_info(f"Data: {data['start_date']} a {data['end_date']}")
        print_info(f"Preço total: R$ {data['total_price']}")
        print_info(f"Status: {data['status']}")
        return True
    else:
        print_error(f"Erro ao criar agendamento: {response.status_code}")
        print_error(response.text)
        return False

def test_list_bookings():
    print_section("8. Teste: Listar Agendamentos do Usuário")
    
    if not access_token:
        print_error("Nenhum token disponível!")
        return False
    
    response = requests.get(f"{BASE_URL}/bookings/user_bookings/", headers=get_headers())
    
    if response.status_code == 200:
        data = response.json()
        print_success(f"Total de agendamentos do usuário: {len(data)}")
        
        if data:
            booking = data[0]
            print_info("Primeiro agendamento:")
            print(f"  - Propriedade: {booking['property_title']}")
            print(f"  - Datas: {booking['start_date']} a {booking['end_date']}")
            print(f"  - Status: {booking['status']}")
        
        return True
    else:
        print_error(f"Erro ao listar agendamentos: {response.status_code}")
        print_error(response.text)
        return False

def test_available_dates():
    print_section("9. Teste: Obter Datas Disponíveis")
    
    if property_id is None:
        print_error("Nenhuma propriedade criada ainda!")
        return False
    
    response = requests.get(
        f"{BASE_URL}/bookings/available_dates/?property_id={property_id}",
        headers=get_headers()
    )
    
    if response.status_code == 200:
        data = response.json()
        booked_dates = data.get("booked_dates", [])
        print_success(f"Datas bloqueadas: {len(booked_dates)}")
        
        if booked_dates:
            print_info(f"Primeiras datas bloqueadas: {booked_dates[:5]}")
        
        return True
    else:
        print_error(f"Erro ao obter datas: {response.status_code}")
        print_error(response.text)
        return False

def test_filter_properties():
    print_section("10. Teste: Filtrar Propriedades por Cidade")
    
    response = requests.get(
        f"{BASE_URL}/properties/?city=São Paulo",
        headers=get_headers()
    )
    
    if response.status_code == 200:
        data = response.json()
        results = data.get("results", [])
        print_success(f"Propriedades em São Paulo: {len(results)}")
        return True
    else:
        print_error(f"Erro ao filtrar: {response.status_code}")
        print_error(response.text)
        return False

# ============================================
# MAIN
# ============================================

property_id = None
booking_id = None

def main():
    global property_id, booking_id
    
    print(f"\n{Colors.BLUE}")
    print("╔════════════════════════════════════════════════════════════╗")
    print("║         TESTES DA API - APS BACKEND DJANGO                 ║")
    print("╚════════════════════════════════════════════════════════════╝")
    print(f"{Colors.RESET}")
    
    # Verificar se servidor está rodando
    try:
        response = requests.get(f"{BASE_URL}/properties/", timeout=5)
    except requests.exceptions.ConnectionError:
        print_error(f"Não foi possível conectar a {BASE_URL}")
        print_info("Certifique-se de que o servidor Django está rodando!")
        print_info("Execute: docker-compose up -d")
        return
    
    results = []
    
    # Executar testes
    results.append(("Registrar usuário", test_register()))
    results.append(("Login", test_login()))
    results.append(("Obter perfil", test_get_profile()))
    results.append(("Criar propriedade", test_create_property()))
    results.append(("Listar propriedades", test_list_properties()))
    results.append(("Detalhes propriedade", test_get_property_details()))
    results.append(("Criar agendamento", test_create_booking()))
    results.append(("Listar agendamentos", test_list_bookings()))
    results.append(("Datas disponíveis", test_available_dates()))
    results.append(("Filtrar propriedades", test_filter_properties()))
    
    # Resumo
    print_section("RESUMO DOS TESTES")
    
    passed = sum(1 for _, result in results if result)
    total = len(results)
    
    for test_name, result in results:
        status = f"{Colors.GREEN}✓ PASSOU{Colors.RESET}" if result else f"{Colors.RED}✗ FALHOU{Colors.RESET}"
        print(f"{test_name:<30} {status}")
    
    print(f"\n{Colors.BLUE}Resultado: {Colors.RESET}{passed}/{total} testes passaram")
    
    if passed == total:
        print(f"{Colors.GREEN}✓ TODOS OS TESTES PASSARAM! 🎉{Colors.RESET}\n")
    else:
        print(f"{Colors.YELLOW}⚠ Alguns testes falharam!{Colors.RESET}\n")

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print(f"\n{Colors.YELLOW}Testes interrompidos pelo usuário.{Colors.RESET}\n")
    except Exception as e:
        print_error(f"Erro inesperado: {e}")
