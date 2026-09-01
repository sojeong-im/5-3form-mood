import { initializeApp } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js";
import { getFirestore, collection, getDocs, query, orderBy } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAXR0Z0nh2_81JRNOKP6HwElHIUgciK1wA",
  authDomain: "beu-209eb.firebaseapp.com",
  projectId: "beu-209eb",
  storageBucket: "beu-209eb.firebasestorage.app",
  messagingSenderId: "953956944176",
  appId: "1:953956944176:web:7cbe6fcabbc8963b47e0f5"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const loginScreen = document.getElementById('login-screen');
const dashboardScreen = document.getElementById('dashboard-screen');
const passwordInput = document.getElementById('password-input');
const loginBtn = document.getElementById('login-btn');
const tableBody = document.getElementById('table-body');
const totalCount = document.getElementById('total-count');
const refreshBtn = document.getElementById('refresh-btn');

const ADMIN_PASSWORD = "00347";

function login() {
    if (passwordInput.value === ADMIN_PASSWORD) {
        loginScreen.style.display = 'none';
        dashboardScreen.style.display = 'block';
        fetchData();
    } else {
        alert("비밀번호가 틀렸습니다.");
    }
}

loginBtn.addEventListener('click', login);
passwordInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') login();
});
refreshBtn.addEventListener('click', fetchData);

async function fetchData() {
    tableBody.innerHTML = '<tr><td colspan="7" style="text-align: center; padding: 20px;">데이터를 불러오는 중입니다...</td></tr>';
    
    try {
        const q = query(collection(db, "applications"), orderBy("timestamp", "desc"));
        const querySnapshot = await getDocs(q);
        
        tableBody.innerHTML = '';
        totalCount.innerText = querySnapshot.size;
        
        if (querySnapshot.empty) {
            tableBody.innerHTML = '<tr><td colspan="7" style="text-align: center; padding: 20px;">아직 접수된 신청서가 없습니다.</td></tr>';
            return;
        }

        querySnapshot.forEach((doc) => {
            const data = doc.data();
            
            // 날짜 변환 로직 (Firestore Timestamp 처리)
            let dateStr = '-';
            if (data.timestamp) {
                if (data.timestamp.toDate) {
                    dateStr = data.timestamp.toDate().toLocaleString();
                } else {
                    dateStr = new Date(data.timestamp).toLocaleString();
                }
            }
            
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${data.q1 || '-'}</td>
                <td>${data.q2 || '-'}</td>
                <td>${data.q3 || '-'}</td>
                <td>${data.q4 || '-'}</td>
                <td>${data.q5 || '-'}</td>
                <td>${data.q6 || '-'}</td>
                <td>${dateStr}</td>
            `;
            tableBody.appendChild(tr);
        });
    } catch (error) {
        console.error("Error fetching documents: ", error);
        tableBody.innerHTML = '<tr><td colspan="7" style="text-align: center; color: red; padding: 20px;">데이터를 불러오는데 실패했습니다. (콘솔 확인)</td></tr>';
    }
}
