# Phase 1: 기반 설정

## 1.1 서명 키 생성

Tauri 업데이터는 모든 업데이트에 서명을 요구한다. 개인키로 빌드 시 서명하고, 공개키로 검증한다.

```bash
# 키 생성 (비밀번호 설정 권장)
bun tauri signer generate -- -w ~/.tauri/svg2tsx.key
```

출력 예시:
```
Please enter a password to protect the secret key.
Password:
Password (one more time):

Deriving a key from the password and target directories in order to be as secure as possible.
This will take some time...

Your keypair was generated successfully
Private key: /Users/username/.tauri/svg2tsx.key
Public key:  dW50cnVzdGVkIGNvbW1lbnQ6IG1pbmlzaWduIHB1YmxpYyBrZXk6...
```

> ⚠️ **중요**: 개인키를 잃어버리면 기존 사용자에게 업데이트를 배포할 수 없다!

### 키 보관

```bash
# 개인키 파일 위치 확인
ls -la ~/.tauri/svg2tsx.key

# 공개키는 tauri.conf.json에 추가할 것이므로 복사해둔다
```

## 1.2 Rust 의존성 추가

`src-tauri/Cargo.toml`에 추가:

```toml
[dependencies]
# 기존 의존성...
tauri-plugin-updater = "2"
tauri-plugin-process = "2"  # 앱 재시작용
```

또는 CLI로 추가:

```bash
cd src-tauri
cargo add tauri-plugin-updater tauri-plugin-process
```

## 1.3 프론트엔드 의존성 추가

```bash
bun add @tauri-apps/plugin-updater @tauri-apps/plugin-process
```

## 1.4 .gitignore 확인

개인키가 실수로 커밋되지 않도록:

```gitignore
# Tauri signing keys
*.key
.tauri/
```

## 완료 체크리스트

- [ ] 서명 키 생성 완료 (`~/.tauri/svg2tsx.key`)
- [ ] 공개키 복사해둠
- [ ] `tauri-plugin-updater` Cargo.toml에 추가
- [ ] `tauri-plugin-process` Cargo.toml에 추가
- [ ] `@tauri-apps/plugin-updater` 프론트엔드에 추가
- [ ] `@tauri-apps/plugin-process` 프론트엔드에 추가
- [ ] `.gitignore`에 키 파일 제외 확인
