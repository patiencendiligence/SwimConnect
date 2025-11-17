#!/bin/bash
# Glassmorphism 스타일 일괄 적용 스크립트

echo "🎨 Glassmorphism 디자인 적용 중..."

# 남은 화면들에 기본 배경색 변경
for file in src/screens/Auth/*.tsx src/screens/Profile/*.tsx src/screens/Pool/*.tsx; do
  if [ -f "$file" ]; then
    # 기본 배경색 변경
    sed -i.bak "s/backgroundColor: '#fff'/backgroundColor: '#f9fcff'/g" "$file"
    sed -i.bak "s/backgroundColor: '#f8f8f8'/backgroundColor: '#f9fcff'/g" "$file"
    
    echo "✓ Updated: $file"
  fi
done

echo "✅ Glassmorphism 기본 배경색 적용 완료!"
echo "📝 자세한 가이드는 GLASSMORPHISM_GUIDE.md를 참조하세요."
