// main.js
let students = JSON.parse(localStorage.getItem('students') || '[]'); // 全局学生列表
let currentPage = 1; // 当前页码
const pageSize = 5; // 每页显示5条

// 页面加载完成后初始化
window.addEventListener('DOMContentLoaded', () => {
  renderStudentList(); // 渲染学生列表
  bindEvents(); // 绑定所有事件
});

// 渲染学生列表（支持分页）
function renderStudentList() {
  const studentList = document.getElementById('studentList');
  studentList.innerHTML = ''; // 清空现有内容

  // 分页处理：计算当前页数据
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentStudents = students.slice(startIndex, endIndex); // 截取当前页数据

  // 生成表格行
  currentStudents.forEach(student => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${student.id}</td>
      <td>${student.name}</td>
      <td>${student.gender}</td>
      <td>${student.age}</td>
      <td>${student.className}</td>
      <td>${student.major}</td>
      <td>${student.phone}</td>
      <td>
        <button class="editBtn" data-id="${student.id}">编辑</button>
        <button class="deleteBtn" data-id="${student.id}">删除</button>
      </td>
    `;
    studentList.appendChild(tr);
  });

  // 更新分页信息
  const totalPages = Math.ceil(students.length / pageSize);
  document.getElementById('pageInfo').textContent = `第 ${currentPage} 页 / 共 ${totalPages} 页`;
}
// 绑定事件
function bindEvents() {
  // 点击新增按钮：打开弹窗（重置表单为新增模式）
    document.getElementById('addBtn').addEventListener('click', () => {
    document.getElementById('modalTitle').textContent = '新增学生';
    document.getElementById('formType').value = 'add';
    document.getElementById('studentForm').reset(); // 清空表单
    document.getElementById('editId').value = ''; // 清空编辑id
    document.getElementById('formModal').style.display = 'block'; // 显示弹窗
  });

  // 表单提交：新增或编辑学生
  document.getElementById('studentForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const formType = document.getElementById('formType').value;
    const studentData = {
      id: document.getElementById('id').value.trim(),
      name: document.getElementById('name').value.trim(),
      gender: document.getElementById('gender').value,
      age: parseInt(document.getElementById('age').value),
      className: document.getElementById('className').value.trim(),
      major: document.getElementById('major').value.trim(),
      phone: document.getElementById('phone').value.trim()
    };

    if (formType === 'add') {
      // 新增：验证学号是否已存在
      const isIdExist = students.some(s => s.id === studentData.id);
      if (isIdExist) {
        alert('学号已存在，请更换！');
        return;
      }
      students.push(studentData); // 添加到数组
    } else {
      // 编辑：根据id更新数据（后面讲）
      const editId = document.getElementById('editId').value;
      const index = students.findIndex(s => s.id === editId);
      students[index] = studentData;
    }

    // 保存到本地存储并重新渲染
    localStorage.setItem('students', JSON.stringify(students));
    renderStudentList();
    document.getElementById('formModal').style.display = 'none'; // 关闭弹窗
    alert(formType === 'add' ? '新增成功！' : '编辑成功！');
  });
}
// 在bindEvents()中添加编辑按钮事件（利用事件委托，因为按钮是动态生成的）
document.getElementById('studentList').addEventListener('click', (e) => {
  if (e.target.classList.contains('editBtn')) {
    const id = e.target.getAttribute('data-id');
    const student = students.find(s => s.id === id); // 找到要编辑的学生
    if (student) {
      // 回显数据到表单
      document.getElementById('modalTitle').textContent = '编辑学生';
      document.getElementById('formType').value = 'edit';
      document.getElementById('editId').value = id;
      document.getElementById('id').value = student.id;
      document.getElementById('name').value = student.name;
      document.getElementById('gender').value = student.gender;
      document.getElementById('age').value = student.age;
      document.getElementById('className').value = student.className;
      document.getElementById('major').value = student.major;
      document.getElementById('phone').value = student.phone;
      document.getElementById('formModal').style.display = 'block'; // 显示弹窗
    }
  }
});
// 在bindEvents()中添加删除按钮事件（事件委托）
document.getElementById('studentList').addEventListener('click', (e) => {
  if (e.target.classList.contains('deleteBtn')) {
    const id = e.target.getAttribute('data-id');
    if (confirm(`确定要删除学号为${id}的学生吗？`)) {
      // 过滤掉要删除的学生
      students = students.filter(s => s.id !== id);
      // 保存并重新渲染
      localStorage.setItem('students', JSON.stringify(students));
      renderStudentList();
      alert('删除成功！');
    }
  }
});
// 在bindEvents()中添加搜索事件
document.getElementById('searchBtn').addEventListener('click', searchStudents);
document.getElementById('searchInput').addEventListener('keyup', (e) => {
  if (e.key === 'Enter') searchStudents(); // 按回车也能搜索
});

// 搜索逻辑
function searchStudents() {
  const keyword = document.getElementById('searchInput').value.trim().toLowerCase();
  if (!keyword) {
    // 若无关键词，显示所有学生（重置为原始列表）
    students = JSON.parse(localStorage.getItem('students') || '[]');
  } else {
    // 按姓名或学号筛选（不区分大小写）
    const allStudents = JSON.parse(localStorage.getItem('students') || '[]');
    students = allStudents.filter(s => 
      s.name.toLowerCase().includes(keyword) || 
      s.id.toLowerCase().includes(keyword)
    );
  }
  currentPage = 1; // 搜索后重置到第1页
  renderStudentList(); // 重新渲染
}
// 在bindEvents()中添加分页事件
document.getElementById('prevPage').addEventListener('click', () => {
  if (currentPage > 1) {
    currentPage--;
    renderStudentList();
  }
});

document.getElementById('nextPage').addEventListener('click', () => {
  const totalPages = Math.ceil(students.length / pageSize);
  if (currentPage < totalPages) {
    currentPage++;
    renderStudentList();
  }
});