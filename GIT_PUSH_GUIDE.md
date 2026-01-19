# 🚀 Hướng dẫn Push Code lên GitHub

## ✅ Git đã được cấu hình

```bash
User: nguyenngocduy12-debug
Email: nguyenngocduy12@dtu.edu.vn
Repository: https://github.com/nguyenngocduy12-debug/education_cap1.git
Branch: main
```

## 📋 Commits hiện tại

```
037f113 - Update Gemini AI API configuration
59c595a - Initial commit: Education Online Platform
```

---

## 🔑 Cách 1: Push với Personal Access Token (Khuyến nghị)

### Bước 1: Tạo GitHub Personal Access Token

1. Truy cập: https://github.com/settings/tokens
2. Click **"Generate new token"** → **"Generate new token (classic)"**
3. Đặt tên: `Education Platform`
4. Chọn scope: ✅ **repo** (full control of private repositories)
5. Click **"Generate token"**
6. **COPY TOKEN** (chỉ hiện 1 lần!)

### Bước 2: Push Code

```bash
cd /home/ngocduy/education_online

# Cách A: Push và nhập token khi được hỏi
git push -u origin main --force

# Username: nguyenngocduy12-debug
# Password: <DÁN_TOKEN_VÀO_ĐÂY>

# Cách B: Push với token trong URL
git push https://YOUR_TOKEN@github.com/nguyenngocduy12-debug/education_cap1.git main --force
```

---

## 🔐 Cách 2: Push với SSH Key (Bảo mật hơn)

### Bước 1: Tạo SSH Key

```bash
ssh-keygen -t ed25519 -C "nguyenngocduy12@dtu.edu.vn"
# Nhấn Enter 3 lần (không cần passphrase)

cat ~/.ssh/id_ed25519.pub
# Copy toàn bộ nội dung
```

### Bước 2: Thêm SSH Key vào GitHub

1. Truy cập: https://github.com/settings/keys
2. Click **"New SSH key"**
3. Title: `Education Platform`
4. Paste SSH key vừa copy
5. Click **"Add SSH key"**

### Bước 3: Đổi Remote sang SSH

```bash
cd /home/ngocduy/education_online
git remote set-url origin git@github.com:nguyenngocduy12-debug/education_cap1.git
git push -u origin main --force
```

---

## 📝 Các commits tiếp theo

Sau khi push lần đầu thành công, các lần sau chỉ cần:

```bash
cd /home/ngocduy/education_online

# 1. Kiểm tra thay đổi
git status

# 2. Add files
git add .

# 3. Commit
git commit -m "Mô tả thay đổi"

# 4. Push
git push origin main
```

---

## 🛠️ Troubleshooting

### Lỗi 403 Permission denied

```bash
# Xóa credentials cũ
git credential-cache exit
rm ~/.git-credentials

# Push lại và nhập token mới
git push -u origin main --force
```

### Kiểm tra config

```bash
git config --local --list | grep user
git config --local --list | grep remote
```

### Xem logs

```bash
git log --oneline -5
git remote -v
```

---

## ✅ Checklist

- [x] Git config: nguyenngocduy12-debug / nguyenngocduy12@dtu.edu.vn
- [x] Remote: https://github.com/nguyenngocduy12-debug/education_cap1.git
- [x] Branch: main
- [ ] Personal Access Token created
- [ ] Code pushed successfully

---

## 🎯 Quick Command

Nếu bạn đã có token:

```bash
cd /home/ngocduy/education_online
git push https://YOUR_TOKEN@github.com/nguyenngocduy12-debug/education_cap1.git main --force
```

Thay `YOUR_TOKEN` bằng token GitHub của bạn.
