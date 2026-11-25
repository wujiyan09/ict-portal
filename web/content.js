// Structure follows "ICT for iGeneration" (HKDSE version), Compulsory A1–E.
// Knowledge cards and chapter MC are Quest originals (DSE-style), not past-paper questions.
// card: [title, type, body(HTML)] ; mc: [question, [A,B,C,D], answerIndex, explanation]
window.BOOKS = [
{id:"A1",name:"Information Processing (1)",chs:[
{id:"A1C1",n:1,t:"Introduction to Information Processing",sec:["1.1 Information System","1.2 Data and Information","1.3 Information Processing","1.4 Information Age"],
cards:[
["Information system 的 5 个组成","definition","<b>Purpose, Data, Procedure, People, Technology</b>（hardware, software, network）。考试常问某一部分在情境中是什么。"],
["Data vs Information","definition","<b>Data</b>：未处理的原始事实（数字、文字、图像、声音）。<b>Information</b>：经过处理、有意义、可用于决策的结果。同一份数据对不同人可以是不同的信息。"],
["Input–Process–Output (IPO) cycle","method-idea","Input → Process → Output，<b>Storage</b> 与 Process 双向交换数据。处理由 <b>program</b> 控制。"],
["Information processing 的阶段","property","Data collection → Data organisation → Data processing → Data storage → Information dissemination（传播）。处理包括 sorting, searching, calculating, merging, filtering。"],
["Information Age","property","特点：信息量大、传播快、big data 预测、知识型经济。缺点：information overload、digital divide、隐私风险。Information literacy = 能够找、评估、使用并负责任地分享信息。"]],
mc:[
["Which of the following is data rather than information?",["The average score of a class is 62.","The raw marks typed into a spreadsheet","A chart showing the pass rate trend","A list of students ranked by score"],1,"Raw marks have not been processed yet. Averages, charts and rankings are processed results."],
["In the IPO cycle, which component exchanges data with the process in BOTH directions?",["Input","Output","Storage","Program"],2,"Processing reads from and writes to storage."],
["A school library uses barcode scanners to record loans. Which component of the information system is the barcode scanner?",["Purpose","People","Procedure","Technology"],3,"Hardware belongs to Technology."],
["Which is a disadvantage brought by the Information Age?",["Predictions using big data","Information overload","Faster communication","E-learning"],1,"Too much information makes it hard to find what is reliable/relevant."]]},
{id:"A1C2",n:2,t:"Data Control and Data Organisation",sec:["2.1 Data Hierarchy","2.2 Data Control","2.3 Functions of Database","2.4 File Access Method"],
cards:[
["Data hierarchy","definition","bit → byte/character → <b>field</b> → <b>record</b> → <b>file/table</b> → <b>database</b>。"],
["Validation vs Verification","condition","<b>Validation</b>：由电脑检查数据是否合理（range / type / length / format / presence / check digit）。<br><b>Verification</b>：检查数据是否与原始来源一致（double entry、proofreading）。输入密码两次 = verification（2021 DSE Q9）。"],
["Check digit","method-idea","把前面数字按权重计算得出的额外数字（如 ISBN、HKID 括号内的数字），用来侦测打错或调换数字。"],
["Database 的优点（对比 spreadsheet / file）","property","减少 data redundancy、保持 data consistency / integrity、多用户同时存取、存取权限控制、用 query 快速检索。"],
["File access methods","definition","<b>Sequential</b>：按次序读（磁带、批量处理）。<b>Direct/Random</b>：直接定位记录（磁盘，需要 key）。<b>Index sequential</b>：先查 index 再直接跳。"]],
mc:[
["A student keys in a Form of '7' for an S1–S6 school. Which check would detect it?",["Type check","Range check","Length check","Verification"],1,"7 is outside 1–6."],
["Which correctly shows the data hierarchy from smallest to largest?",["field, record, character, file","character, field, record, file","record, field, file, database","character, record, field, file"],1,"Characters form fields, fields form records, records form files."],
["Why does a bank store customer data in a DBMS instead of separate spreadsheets?",["To allow what-if analysis","To reduce data redundancy and keep data consistent","To make the files bigger","To avoid using primary keys"],1,"Central DB → one copy of each fact."],
["Which file access method is most suitable for payroll processed once a month for all staff?",["Sequential","Direct","Random","Indexed only"],0,"Every record is processed in order: sequential (batch)."]]},
{id:"A1C3",n:3,t:"Data Representation",sec:["3.1 Number System and Representation","3.2 Character Encoding","3.3 Barcode Encoding","3.4 Analog and Digital Data","3.5 Multimedia"],
cards:[
["Binary / Octal / Hex 转换","method-idea","4 bits = 1 hex digit，3 bits = 1 octal digit。例：1011 0110₂ = B6₁₆ = 182₁₀。工具页可以练习。"],
["Two's complement（8-bit）","definition","范围 <b>−128 至 +127</b>。负数：取正数的二进制 → 全部反转 → +1。MSB = 1 表示负数。"],
["Overflow 判断","condition","只有<b>两个同号数</b>相加、结果变成<b>异号</b>时才 overflow。异号相加永不 overflow。最高位进位丢弃不等于 overflow。"],
["n 个 bits 可表示多少个值","property","n bits → 2ⁿ 个不同值。表示 N 个项目所需最少 bits = ⌈log₂N⌉。有 parity bit 再 +1（例：17 个候选人 → 5 bits + 1 parity = 6）。"],
["ASCII / Big-5 / GB / Unicode","definition","ASCII：7-bit（128 字符），'A'=41₁₆，'a'=61₁₆，'0'=30₁₆。Big-5 繁体、GB 简体，各 2 bytes。<b>Unicode</b>（UTF-8/16）支持多语言、跨平台，一页可同时显示繁简。"],
["Barcode vs QR code","property","1D barcode 只存少量数字（如 EAN-13，含 check digit）。QR code 是 2D，容量大、可存 URL、有 error correction、可从任何方向扫描。"],
["Analog → Digital","method-idea","ADC：<b>sampling</b>（采样率）+ <b>quantisation</b>（bit depth）。采样率越高、bit depth 越大 → 质量越好、文件越大。"],
["Multimedia 文件大小计算","method-idea","Bitmap = 宽 × 高 × colour depth（bits）÷ 8 bytes。<br>Audio = sampling rate × bit depth × channels × 秒数 ÷ 8。<br>Video ≈ 每帧大小 × frame rate × 秒数。"],
["压缩与格式","property","<b>Lossless</b>：PNG, GIF, ZIP, FLAC。<b>Lossy</b>：JPEG, MP3, MP4。BMP/WAV 未压缩。SVG 是 vector（放大不失真、简单图形文件小）。GIF 支持动画。"]],
mc:[
["What is 1110 1100 in 8-bit two's complement, as a denary number?",["−20","−19","236","−108"],0,"Invert → 0001 0011, +1 → 0001 0100 = 20, so −20."],
["How many bits are needed at least to give each of 200 students a unique code?",["7","8","9","200"],1,"2^7=128 < 200 ≤ 256 = 2^8."],
["The ASCII code of 'C' is 43₁₆. What is the ASCII code of 'f'?",["46₁₆","64₁₆","66₁₆","76₁₆"],2,"'a' = 61₁₆, so 'f' = 66₁₆."],
["A 1024 × 768 image uses 24-bit colour. What is its uncompressed size?",["768 KB","2.25 MB","18 MB","24 MB"],1,"1024×768×3 bytes = 2,359,296 B = 2.25 MB."],
["Which of the following additions in 8-bit two's complement overflows?",["0111 0000 + 1000 0000","0101 0000 + 0011 0000","1111 0000 + 0000 1111","1000 0001 + 0111 1111"],1,"80 + 48 = 128 > 127. Two positives give a 'negative' result."],
["Which file format uses lossless compression?",["JPEG","MP3","PNG","MP4"],2,"PNG is lossless."]]}
]},
{id:"A2",name:"Information Processing (2)",chs:[
{id:"A2C4",n:4,t:"Spreadsheet",sec:["Cell references","Functions","Data analysis (sort, filter, pivot table, what-if, goal seek)","Charts"],
cards:[
["Relative / Absolute / Mixed reference","definition","A1 随复制改变；$A$1 固定；A$1 固定行；$A1 固定列。复制公式时，行/列按移动距离偏移。"],
["常考函数","property","SUM, AVERAGE, MAX, MIN, COUNT, COUNTA, COUNTIF, SUMIF, IF, AND, OR, ROUND, INT, MOD, LEFT, RIGHT, MID, LEN, FIND, VLOOKUP, HLOOKUP, RANK, TODAY。"],
["VLOOKUP","method-idea","=VLOOKUP(lookup_value, table, col_index, [range_lookup])。FALSE = exact match；TRUE/省略 = approximate（table 第一列需升序，常用于分级）。"],
["Pivot table","method-idea","分组汇总大量数据。分组的字段放 <b>ROWS/COLUMNS</b>，要计算的放 <b>VALUES</b>（Sum/Count/Average）。数每人出现次数：同一字段放 ROWS 和 VALUES(Count)。"],
["What-if analysis / Goal seek","definition","<b>What-if</b>：改变输入看结果（scenario, data table）。<b>Goal seek</b>：已知想要的结果，反推单一输入值。"],
["图表选择","property","比较 → bar/column；趋势 → line；占比 → pie；两变量关系 → scatter。"]],
mc:[
["Cell C1 contains =A1*$B$1. It is copied to D3. What is the formula in D3?",["=B3*$B$1","=A3*$B$1","=B3*$C$3","=A1*$B$1"],0,"Moved 1 column right and 2 rows down: A1→B3; $B$1 stays."],
["=MID(\"INFORMATION\",3,4) returns",["FORM","NFOR","ORMA","INFO"],0,"Start at the 3rd character 'F', take 4."],
["Which feature finds the sales needed to reach a profit of $1,000,000?",["Sorting","Goal seek","Filter","Conditional formatting"],1,"Known target, find one input."],
["Which chart best shows how a company's monthly sales changed over a year?",["Pie chart","Line chart","Scatter chart","Radar chart"],1,"Trend over time → line."]]},
{id:"A2C5",n:5,t:"Database",sec:["Database concepts & keys","Relationships and ER diagram","SQL","Forms, queries and reports"],
cards:[
["Keys","definition","<b>Primary key</b>：唯一识别记录、不能为空。<b>Candidate key</b>：可以做 PK 的字段。<b>Foreign key</b>：引用另一表的 PK，建立关系。<b>Composite key</b>：多字段组合成的 PK。"],
["Relationships & ER diagram","definition","1:1、1:M、M:N。M:N 需要 <b>junction table</b>（例：STUDENT–BORROW–BOOK）。ER 图用 crow's foot 表示多。"],
["Referential integrity","condition","Foreign key 的值必须在被引用表中存在（或为 NULL）。防止删除仍被引用的记录。"],
["SQL SELECT 基本结构","method-idea","SELECT 字段 FROM 表 WHERE 条件 GROUP BY 字段 HAVING 组条件 ORDER BY 字段 ASC|DESC。<br>运行次序：FROM → WHERE → GROUP BY → HAVING → SELECT → ORDER BY。"],
["WHERE vs HAVING","condition","WHERE 过滤<b>行</b>（分组前，不能用聚合函数）；HAVING 过滤<b>组</b>（分组后，可用 COUNT/SUM/AVG）。"],
["JOIN","method-idea","SELECT S.NAME, C.CNAME FROM STUDENT S, CLASS C WHERE S.CID = C.CID（等同 INNER JOIN ... ON）。只返回两表都配对得到的行。"],
["常用运算","property","LIKE 'A%'（% 任意长度，_ 一个字符）、BETWEEN a AND b（含两端）、IN (...)、IS NULL、DISTINCT、COUNT(*)、AVG、MAX、MIN、SUM。字符串用单引号；日期格式视软件而定。"],
["Derived attribute","definition","可以从其他数据计算出来的字段（如已借书数目）。好处：查询快；坏处：浪费空间、容易与原数据不一致。"],
["DDL / DML","definition","DDL：CREATE TABLE, ALTER TABLE, DROP TABLE。DML：SELECT, INSERT INTO ... VALUES, UPDATE ... SET ... WHERE, DELETE FROM ... WHERE。"]],
mc:[
["Which SQL clause can filter groups using COUNT(*)?",["WHERE","HAVING","ORDER BY","FROM"],1,"Aggregate conditions go in HAVING."],
["A student can join many clubs and a club has many students. How should this be implemented?",["Put CLUBID in STUDENT","Put STUDENTID in CLUB","Create a junction table with STUDENTID and CLUBID","Merge the two tables"],2,"M:N needs a junction table."],
["What does SELECT COUNT(*) FROM BOOK WHERE PRICE BETWEEN 50 AND 100 count?",["Books with price > 50 and < 100","Books with price ≥ 50 and ≤ 100","All books","Distinct prices"],1,"BETWEEN includes both ends."],
["Which field is the most suitable primary key for a STUDENT table?",["NAME","CLASS","STUDENT_ID","DATE_OF_BIRTH"],2,"Unique and never empty."],
["SELECT NAME FROM S WHERE NAME LIKE '_A%' returns names whose",["first letter is A","second letter is A","last letter is A","name contains A anywhere"],1,"_ matches exactly one character."]]}
]},
{id:"B",name:"Computer System Fundamentals",chs:[
{id:"BC1",n:1,t:"Input and Output Devices",sec:["1.1 Input-Process-Output Cycle","1.2 Input Device","1.3 Output Device","1.4 Application of Computers"],
cards:[
["Input devices","property","Keyboard, mouse, touch screen, scanner（resolution dpi, colour depth）, digital camera, microphone, barcode reader, QR scanner, OCR, OMR（MC 答题纸）, MICR（支票）, RFID / NFC（八达通）, sensors。"],
["Output devices","property","Monitor（resolution, refresh rate, response time）, projector, printers（laser 快、质量高；inkjet 便宜、彩色相片；thermal 收据、无墨；3D printer）, speaker, actuator。"],
["选设备题型","method-idea","看情境：大量 MC 答卷 → OMR；收银收据 → thermal printer；非接触支付 → RFID/NFC；扫描文字变可编辑 → scanner + OCR。"]],
mc:[
["Which input method is most suitable for marking thousands of MC answer sheets?",["OCR","OMR","MICR","RFID"],1,"OMR detects marks in fixed positions."],
["Which printer is commonly used for receipts in shops?",["Laser","Inkjet","Thermal","3D"],2,"Fast, quiet, no ink."],
["Which specification is about a monitor rather than a scanner?",["600 dpi","48-bit colour depth","144 Hz refresh rate","A4 scanning area"],2,"Refresh rate is a display spec."]]},
{id:"BC2",n:2,t:"Computer Hardware",sec:["2.1 System Unit","2.2 Central Processing Unit","2.3 Storage Device","2.4 Type of Computers","2.5 Latest Development of Hardware"],
cards:[
["CPU 组成","definition","<b>CU</b>：fetch、decode 指令，控制其他部件。<b>ALU</b>：算术与逻辑运算。<b>Registers</b>：CPU 内最快的小存储。"],
["Registers","definition","<b>PC</b>（Program Counter）：下一条指令的地址。<b>IR</b>：当前指令。<b>MAR</b>：要存取的内存地址。<b>MDR/MBR</b>：读写的数据。<b>ACC</b>：运算结果。"],
["Machine cycle","method-idea","Fetch（PC→MAR，读内存→MDR→IR，PC+1）→ Decode（CU）→ Execute（ALU 等）→ Store。"],
["Buses","definition","<b>Address bus</b>（单向，宽度决定可寻址内存 2ⁿ）、<b>Data bus</b>（双向，宽度影响每次传送量）、<b>Control bus</b>。"],
["提升 CPU 性能","property","更高 clock rate、更多 cores、更大 cache、更宽 word size / data bus。过热问题 → 多核、改善制程、散热。"],
["Memory hierarchy","property","Registers > Cache > RAM > SSD > HDD（速度由快到慢，容量由小到大，每 GB 价格由高到低）。<b>RAM</b> volatile；<b>ROM</b> non-volatile，存 firmware/BIOS。Cache 存常用数据，减少 CPU 等待 RAM。"],
["Storage devices","property","HDD：便宜、容量大、有机械部件（seek time, rotational latency）。SSD：快、耐震、省电、较贵。Optical（CD/DVD/BD）、flash（USB, SD）、cloud。"],
["Types of computers","definition","Supercomputer, mainframe, server, desktop, laptop, tablet, smartphone, embedded system, wearable。"]],
mc:[
["Which register holds the address of the next instruction?",["MAR","MDR","PC","ACC"],2,"Program Counter."],
["An address bus is 32 bits wide. What is the maximum number of memory locations it can address?",["32","2^16","2^32","32^2"],2,"2^n locations."],
["Which statement about cache memory is correct?",["It is non-volatile.","It is slower than RAM.","It stores frequently used data and instructions.","It replaces the hard disk."],2,"Cache reduces waiting for RAM."],
["Why is an OS usually installed on an SSD rather than an HDD?",["SSD is cheaper per GB","OS files are frequently accessed and SSD is faster","HDD cannot store system files","SSD has a larger capacity"],1,"Same idea as 2021 DSE Q17."]]},
{id:"BC3",n:3,t:"Computer Software",sec:["3.1 Computer System","3.2 System Software","3.3 Application Software","3.4 Mode of Operation"],
cards:[
["System software","definition","<b>OS</b>（管理资源、文件、内存、进程、提供 UI）、<b>utility programs</b>（antivirus, backup, disk defragmenter, compression）、<b>device drivers</b>、language translators。"],
["Translators","definition","<b>Compiler</b>：一次过翻译成 object code，执行快，源码不必分发。<b>Interpreter</b>：逐句翻译执行，方便除错，较慢。<b>Assembler</b>：assembly → machine code。"],
["Software licensing 类型","definition","Proprietary, shareware, freeware, open source（可看可改源码）, public domain。"],
["Modes of operation","definition","<b>Batch</b>：集中一次处理（payroll）。<b>Online/Interactive</b>：用户即时交互。<b>Real-time</b>：立即回应（飞行控制、游戏）。Multi-tasking、multi-user、time-sharing、distributed、parallel processing。"]],
mc:[
["Which is a utility program?",["Word processor","Disk defragmenter","Compiler for Python","Web browser"],1,"Maintains the system."],
["Which is an advantage of a compiler over an interpreter?",["Easier to debug line by line","The compiled program runs faster","No need for source code at all","It works for HTML"],1,"Translated once, runs fast."],
["Monthly electricity bills printed for all customers overnight use",["real-time processing","batch processing","interactive processing","time-sharing"],1,"Collect, then process together."]]}
]},
{id:"C1",name:"Internet and its Applications (1)",chs:[
{id:"C1C1",n:1,t:"Networking and Internet Basics",sec:["1.1 Introduction to Computer Networks","1.2 Network Architecture","1.3 Network Services","1.4 Network Hardware","1.5 Methods of Internet Access"],
cards:[
["LAN / WAN / MAN / PAN","definition","按覆盖范围分。WLAN 用 Wi-Fi。Internet 是最大的 WAN。"],
["Client-server vs Peer-to-peer","property","<b>Client-server</b>：集中管理、备份、安全较好，但 server 故障影响全部、成本高。<b>P2P</b>：便宜易设，但难管理、安全较差。"],
["Network hardware","definition","<b>Switch</b>：在 LAN 内按 MAC 地址转发。<b>Router</b>：连接不同网络，按 IP 选路。<b>Access point</b>：让无线设备加入有线网络。<b>Modem</b>：数码 ↔ 模拟信号。<b>NIC</b>：有唯一 MAC address（48 bits）。<b>Firewall</b>。"],
["Transmission media","property","Twisted pair（便宜）、coaxial、<b>fibre optic</b>（速度最快、距离远、不受电磁干扰）、wireless（Wi-Fi, Bluetooth, 4G/5G）。"],
["Internet access","definition","Broadband（fibre, cable）、mobile data（4G/5G）、Wi-Fi hotspot、satellite。Bandwidth 以 bps 计算。"],
["Intranet / Extranet / VPN","definition","Intranet：机构内部用 Internet 技术。Extranet：开放部分给合作伙伴。VPN：透过 Internet 建立加密通道连回内部网络。"],
["Cloud services","property","好处：不需自行维护 server、不需额外技术人员、容量弹性、随时存取。坏处：依赖 Internet 带宽、私隐/保安、长期费用。"]],
mc:[
["Which device connects a school LAN to the Internet?",["Switch","Router","Access point","Hub"],1,"Router joins networks."],
["Which transmission medium is least affected by electromagnetic interference?",["Twisted pair","Coaxial cable","Fibre optic cable","Wi-Fi"],2,"Light, not electricity."],
["Which is an advantage of a client-server network over a peer-to-peer network?",["Lower set-up cost","Centralised backup and security","No server needed","Every computer has equal role"],1,"Central control."],
["Staff work from home and need to access the office file server securely. Which should be set up?",["Extranet website","VPN","Bluetooth","Public Wi-Fi"],1,"Encrypted tunnel to the internal network."]]},
{id:"C1C2",n:2,t:"Internet Protocols",sec:["2.1 TCP/IP","2.2 Internet Protocol (IP) Address","2.3 Domain Name System (DNS)","2.4 Uniform Resource Locator (URL)","2.5 Network Protocols"],
cards:[
["TCP/IP","definition","<b>TCP</b>：把数据分成 packets、编号、确认收到、重传，保证完整按序。<b>IP</b>：为每个 packet 定址和选路。UDP：不保证送达，但快（streaming、game）。"],
["IPv4 vs IPv6","property","IPv4：32 bits，4 组十进制（0–255），约 43 亿个地址，不够用。IPv6：128 bits，8 组 16 进制，用 : 分隔。"],
["Subnet mask","method-idea","IP AND mask = network address。/24 = 255.255.255.0，主机数 = 2⁸ − 2 = 254（减 network 和 broadcast address）。同一 network address 的设备可直接通信。"],
["Private IP / NAT / DHCP","definition","Private ranges：10.x.x.x、172.16–31.x.x、192.168.x.x，不能直接在 Internet 路由，靠 <b>NAT</b> 共用一个 public IP。<b>DHCP</b> 自动分配 IP。"],
["DNS","method-idea","把 domain name 翻译成 IP address。FQDN 例：www.hkeaa.edu.hk（host.second-level.top-level）。"],
["URL 结构","definition","protocol://domain:port/path/file?query，例：https://www.abc.com.hk/news/index.html。"],
["常见 protocols","property","HTTP/HTTPS（网页，80/443）、FTP（文件传输）、SMTP（发电邮）、POP3（下载并通常删除）、IMAP（在 server 同步多设备）、SSH、DHCP、DNS。"]],
mc:[
["What does DNS do?",["Assigns IP addresses automatically","Translates domain names into IP addresses","Encrypts web pages","Stores browsing history"],1,"Name → IP."],
["How many usable host addresses are there in 192.168.5.0/26?",["62","64","30","126"],0,"32−26 = 6 host bits: 2^6 − 2 = 62."],
["Which protocol keeps emails synchronised on the server for a phone and a laptop?",["POP3","SMTP","IMAP","FTP"],2,"IMAP keeps mail on the server."],
["Which is a valid IPv4 address?",["192.168.1.256","10.0.0.1","172.16.1","2001:db8::1"],1,"256 is out of range; D is IPv6."],
["Which is responsible for re-sending lost packets?",["IP","TCP","DNS","DHCP"],1,"TCP is reliable."]]},
{id:"C1C3",n:3,t:"Internet Services and Applications",sec:["3.1 Internet Applications","3.2 Online Services","3.3 Information Search","3.4 Multimedia on the Web","3.5 Streaming"],
cards:[
["Email: To / CC / BCC","condition","BCC 的收件人对其他人隐藏。群发给会员时把地址放 BCC，保护私隐。"],
["Search techniques","method-idea","\"exact phrase\"、AND / OR / NOT（-）、site:、filetype:。评估资料：authority, accuracy, currency, objectivity。"],
["Streaming","definition","边下载边播放，不必先下载整个文件。需要 buffer；live streaming vs on-demand。比下载省本地储存，但需稳定带宽。"],
["Online services","property","E-commerce, e-banking, e-government (GovHK, iAM Smart), e-learning, social media, cloud storage, video conferencing。"]],
mc:[
["Why should a club secretary put members' addresses in BCC when sending a notice?",["To send faster","To hide members' email addresses from each other","To encrypt the email","To get read receipts"],1,"Privacy."],
["Which is an advantage of streaming over downloading a video?",["Can be watched offline later","Playback can start before the whole file arrives","Needs no Internet","Better video quality always"],1,"Buffered playback."],
["Which search query finds PDF files about DSE ICT on hkeaa.edu.hk?",["DSE ICT pdf","DSE ICT site:hkeaa.edu.hk filetype:pdf","\"DSE ICT\" OR hkeaa","DSE -ICT pdf"],1,"site: and filetype: operators."]]}
]},
{id:"C2",name:"Internet and its Applications (2)",chs:[
{id:"C2C4",n:4,t:"Elementary Web Authoring",sec:["4.1 Basic Components of a Web Page","4.2 Hypertext Markup Language","4.3 Website Structure","4.4 Web Interface Design","4.5 Publishing Websites"],
cards:[
["HTML 基本标签","property","&lt;html&gt;&lt;head&gt;&lt;title&gt;&lt;body&gt;、&lt;h1&gt;–&lt;h6&gt;、&lt;p&gt;、&lt;a href&gt;、&lt;img src alt&gt;、&lt;table&gt;&lt;tr&gt;&lt;td&gt;、&lt;ul&gt;&lt;ol&gt;&lt;li&gt;、&lt;form&gt;&lt;input&gt;。HTML 由 browser 解释，<b>不需 compile</b>。"],
["Absolute vs relative URL","definition","Absolute：完整 https://...。Relative：相对当前文件（images/a.png、../index.html），搬整个网站时链接仍有效。"],
["Website structure","definition","Linear、hierarchical、web/network。Home page 作入口，导航要一致。"],
["UI design 考虑","property","Font size、colour/contrast、language、consistent navigation、accessibility（alt text）、responsive design（不同屏幕）、loading speed。"],
["Publishing","method-idea","买 domain name + web hosting，用 FTP/SFTP 或网页面板上传。Static vs dynamic（server-side script + database）。"]],
mc:[
["Which tag creates a hyperlink?",["&lt;link&gt;","&lt;a&gt;","&lt;href&gt;","&lt;url&gt;"],1,"&lt;a href=\"...\"&gt;"],
["Why use relative URLs for internal links?",["They load faster","Links still work after moving the whole site to another server","They are more secure","Search engines require them"],1,"Paths are relative to the site."],
["What is the purpose of the alt attribute of &lt;img&gt;?",["Sets image size","Shows text when the image cannot be shown / for screen readers","Compresses the image","Adds a border"],1,"Accessibility."]]},
{id:"C2C5",n:5,t:"Network Security and Privacy Threats",sec:["5.1 Network Security Risks","5.2 Effective Measures to Improve Network Security","5.3 Online Privacy Threats","5.4 Methods to Protect Online Privacy"],
cards:[
["Malware","definition","<b>Virus</b>（附在文件、需执行才传播）、<b>Worm</b>（自行经网络复制）、<b>Trojan horse</b>（伪装成有用程序）、<b>Ransomware</b>（加密文件勒索）、Spyware / keylogger、Adware、Botnet。"],
["Attacks","definition","<b>Phishing</b>（假网站/电邮骗登入资料）、<b>DoS/DDoS</b>（大量请求令服务瘫痪）、Hacking、Man-in-the-middle、Pharming（DNS 被篡改）、Social engineering。"],
["保护措施","property","Firewall（按规则过滤进出流量）、antivirus（更新 virus definition）、强密码 + 2FA、定期 patch / update、backup、access rights、加密 Wi-Fi（WPA2/WPA3）、教育用户。"],
["Privacy threats","property","Cookies（追踪浏览）、tracking、数据外泄、过度分享。保护：私隐设定、incognito、清除 cookies、用 HTTPS、只提供必要资料。PDPO（Cap. 486）保障个人资料。"]],
mc:[
["Which malware spreads by itself through a network without attaching to a file?",["Virus","Worm","Trojan horse","Adware"],1,"Worms self-replicate."],
["A fake bank email asks users to log in through a link. This is",["DDoS","Phishing","Ransomware","Spam filtering"],1,"Steal credentials."],
["How does a firewall protect a network?",["It removes viruses from files","It filters incoming/outgoing traffic based on rules","It encrypts all files","It backs up data"],1,"Rule-based filtering."]]},
{id:"C2C6",n:6,t:"Network Security Measures",sec:["6.1 Information Encryption Technologies","6.2 Authentication Methods","6.3 Security Measures in Online Transaction","6.4 Latest Network Security Measures"],
cards:[
["Symmetric vs Asymmetric encryption","definition","<b>Symmetric</b>：同一 key 加密解密，快，但要安全交换 key。<b>Asymmetric</b>：public key 加密 → 只有 private key 能解密。"],
["Digital signature","method-idea","发送者用<b>自己的 private key</b> 签署（加密 hash），收件人用<b>发送者的 public key</b> 验证 → 证明身份（authentication）+ 内容未被改（integrity）+ non-repudiation。"],
["发机密文件用哪个 key？","condition","机密：用<b>收件人的 public key</b> 加密，收件人用自己的 private key 解密。签名：用<b>自己的 private key</b>。"],
["Digital certificate / CA / HTTPS","definition","CA（如 Hongkong Post）发 certificate，证明 public key 属于谁。HTTPS = HTTP + SSL/TLS，浏览器显示锁头。"],
["Authentication methods","property","Something you know（password, PIN）、have（token, phone OTP, smart card）、are（biometrics：fingerprint, face）。2FA/MFA 结合两种以上。"]],
mc:[
["Amy wants to send a confidential document to Ben. Which key should Amy use to encrypt it?",["Amy's private key","Amy's public key","Ben's public key","Ben's private key"],2,"Only Ben's private key can decrypt."],
["A digital signature is verified using",["the sender's public key","the sender's private key","the receiver's private key","a symmetric key"],0,"Signed with sender's private key."],
["Which is an example of two-factor authentication?",["Password + security question","Password + OTP sent to phone","Two passwords","Username + password"],1,"Know + have."]]}
]},
{id:"D1",name:"Computational Thinking and Programming (1)",note:"D1 课本未在 Drive 找到，内容按 DSE 课程大纲编写。",chs:[
{id:"D1C1",n:1,t:"Problem-Formulation and Analysis",sec:["Problem definition","Input / Process / Output analysis","Decomposition"],
cards:[
["Problem-solving 步骤","method-idea","定义问题 → 分析（input、output、process、限制）→ 设计算法 → 编写程序 → 测试与除错 → 文件记录与维护。"],
["Computational thinking","definition","<b>Decomposition</b>（拆小）、<b>Pattern recognition</b>、<b>Abstraction</b>（只保留重要细节）、<b>Algorithm design</b>。"]],
mc:[
["Defining the scope of a problem happens",["after testing","before designing the algorithm","during debugging","after documentation"],1,"Problem definition comes first."],
["Breaking a large problem into smaller sub-problems is called",["abstraction","decomposition","iteration","validation"],1,"Decomposition."]]},
{id:"D1C2",n:2,t:"Algorithm Design (I)",sec:["Pseudocode & flowcharts","Sequence, selection, iteration","Trace tables"],
cards:[
["Flowchart 符号","definition","椭圆：start/end；平行四边形：input/output；长方形：process；菱形：decision。"],
["三种控制结构","definition","Sequence、Selection（if, case）、Iteration（for, while：先检查；repeat…until：后检查，至少执行一次）。"],
["Trace table","method-idea","每一行记录一次变量改变。repeat-until 先做再判断，留意最后一次。常考：余数输出 = 二进制倒序（2021 DSE Q29）。"],
["Boolean 运算","property","NOT > AND > OR。用真值表逐项计算括号内的值。"]],
mc:[
["How many times does 'Repeat ... Until i > 5' run if i starts at 10 and i ← i + 1 inside?",["0","1","5","Infinite"],1,"Repeat-until runs at least once."],
["X ← 0; for i from 1 to 4 do X ← X + i; Output X. What is output?",["4","6","10","24"],2,"1+2+3+4."],
["Which flowchart symbol represents a decision?",["Rectangle","Diamond","Parallelogram","Oval"],1,"Diamond."]]},
{id:"D1C3",n:3,t:"Algorithm Design (II)",sec:["Arrays","Searching: linear, binary","Sorting: bubble, (insertion, selection)","Modularity"],
cards:[
["Linear vs Binary search","property","<b>Linear</b>：逐个比较，数据不用排序，最多 n 次。<b>Binary</b>：数据<b>必须已排序</b>，每次取中间减半，最多约 log₂n + 1 次。"],
["Bubble sort","method-idea","相邻比较、需要时交换；每一 pass 把最大值推到最后。n 个数最多 n−1 passes。若一个 pass 没交换可提早结束。"],
["Modularity","property","把程序分成 subprogram：易读、易测试除错、可重用、多人分工、易维护。Parameter：by value / by reference；local vs global variable。"]],
mc:[
["Binary search requires the data to be",["stored in a linked list","sorted","numeric only","fewer than 100 items"],1,"Halving needs order."],
["After one pass of bubble sort (ascending) on 5, 1, 4, 2, 8, the list is",["1, 4, 2, 5, 8","1, 2, 4, 5, 8","1, 5, 4, 2, 8","5, 1, 4, 2, 8"],0,"5 bubbles towards the end; 8 stays."],
["At most how many comparisons does binary search need for 100 sorted items?",["7","10","50","100"],0,"2^7 = 128 ≥ 100."]]}
]},
{id:"D2",name:"Computational Thinking and Programming (2)",chs:[
{id:"D2C4",n:4,t:"Introduction to Python Programming",sec:["4.1 Program Development","4.2 Basic Programming Concepts","4.3 Selection","4.4 Iteration"],
cards:[
["Data types","definition","int, float, str, bool。int(input()) 转换输入。// 整除，% 余数，** 次方。"],
["Selection","method-idea","if / elif / else。比较：== != &lt; &gt; &lt;= &gt;=；逻辑：and or not。"],
["Iteration","method-idea","for i in range(a, b, step)：不包括 b。while 条件：先检查。break 离开循环。"]],
mc:[
["What is the output of print(17 // 5, 17 % 5)?",["3 2","3.4 2","2 3","3 3"],0,"Integer division and remainder."],
["for i in range(2, 10, 3): print(i, end=' ') outputs",["2 5 8","2 5 8 11","3 6 9","2 4 6 8"],0,"Stops before 10."],
["x = 5\nwhile x > 0:\n    x = x - 2\nprint(x)",["0","−1","1","−2"],1,"5→3→1→−1."]]},
{id:"D2C5",n:5,t:"Integrated Problem-solving in Python",sec:["5.1 Lists","5.2 Integrated Application of Lists","5.3 Integrated Application of Python Strings","5.4 Integrated Programming"],
cards:[
["List 操作","property","a[0] 第一个，a[-1] 最后一个，len(a)，a.append(x)，a.pop()，a.insert(i,x)，a.remove(x)，切片 a[1:3]（不含 3），sum/max/min。"],
["String 操作","property","s[i]、s[a:b]、len(s)、s.upper()/lower()、s.find(x)（找不到返回 −1）、s.split()、s.replace()、ord('A')=65、chr(66)='B'。String 不可直接修改。"],
["常见算法套路","method-idea","累加/计数、找最大最小、线性搜索、频率统计（用 list 或 dict）、Caesar cipher（ord/chr + % 26）、回文判断 s == s[::-1]。"]],
mc:[
["a = [3, 8, 1, 9]; print(a[1:3])",["[8, 1]","[3, 8, 1]","[8, 1, 9]","[1, 9]"],0,"Index 1 and 2."],
["s = 'ICTDSE'; print(s[-3:])",["DSE","ICT","TDS","E"],0,"Last three characters."],
["chr(ord('C') + 3) gives",["'F'","'D'","'c'","70"],0,"67+3 = 70 → 'F'."]]},
{id:"D2C6",n:6,t:"Program Testing and Debugging",sec:["6.1 Testing Programs","6.2 Program Errors and Debugging","6.3 Program Design","6.4 Algorithm Comparison"],
cards:[
["错误类型","definition","<b>Syntax error</b>：违反语法，不能运行。<b>Run-time error</b>：运行时出错（除以 0、index 超出范围）。<b>Logic error</b>：能运行但结果错。"],
["Test data","definition","<b>Normal</b>、<b>boundary/extreme</b>（边界值，如 0 和 100）、<b>abnormal/erroneous</b>（无效输入，如 −5、'abc'）。"],
["Debugging 方法","method-idea","Trace table / dry run、加 print、breakpoint、step-through、watch variables。"],
["Algorithm comparison","property","比较时间（步骤数）、空间、易读性。Binary search 比 linear search 快，但需要排序。"]],
mc:[
["A program crashes when dividing by zero. This is a",["syntax error","run-time error","logic error","compile error"],1,"Occurs during execution."],
["Valid marks are 0 to 100. Which are boundary test data?",["50","0 and 100","−1","abc"],1,"Edges of the valid range."],
["A program calculating an average divides by (n + 1) by mistake. This is a",["syntax error","run-time error","logic error","linking error"],2,"Runs but gives the wrong answer."]]}
]},
{id:"E",name:"Social Implications",chs:[
{id:"EC1",n:1,t:"Technological Innovations",sec:["1.1 Artificial Intelligence (AI) and Data Science","1.2 3D Printing Technologies","1.3 3D Visualisation"],
cards:[
["AI","definition","机器学习（从数据中学习规律）、应用：图像/语音识别、chatbot、推荐系统、自动驾驶。问题：bias、私隐、解释性、就业影响。"],
["Big data & data science","definition","大量、多样、快速的数据（Volume, Variety, Velocity），用来分析和预测。"],
["3D printing","property","Additive manufacturing，按层制造。好处：原型快、可客制化、减少浪费。问题：速度慢、材料限制、版权/武器风险。"],
["VR / AR / MR","definition","<b>VR</b>：完全虚拟环境（头戴设备）。<b>AR</b>：在真实画面上叠加虚拟资讯（Pokémon GO）。<b>MR</b>：虚实互动。"]],
mc:[
["Pokémon GO showing creatures on the camera view of a real street is an example of",["VR","AR","3D printing","Big data"],1,"Overlay on the real world."],
["Which is a concern of AI recruitment systems?",["Faster screening","Bias from training data","Lower cost","24-hour availability"],1,"Biased data → biased decisions."]]},
{id:"EC2",n:2,t:"Health and Ethical Issues",sec:["2.1 Health and Safety","2.2 Internet Addiction","2.3 Freedom of Information","2.4 Cyberbullying","2.5 Information Reliability","2.6 Digital Equity and Digital Divide","2.7 IT and Environment"],
cards:[
["Health and safety","property","RSI、眼睛疲劳、背痛：休息、ergonomic 桌椅、屏幕距离与高度、适当光线。"],
["Digital divide","definition","能否获得及使用 IT 的差距（收入、年龄、地区、教育）。对策：资助设备与上网、公共 Wi-Fi、培训长者。"],
["Information reliability","method-idea","检查作者/来源、日期、交叉核对多个来源、注意偏见和 fake news。"],
["IT and environment","property","E-waste、耗电。对策：回收、节能设定、延长使用、云端虚拟化、green computing。"]],
mc:[
["Which measure best reduces the digital divide among the elderly?",["Raising broadband prices","IT training courses at community centres","Removing public Wi-Fi","Selling only high-end phones"],1,"Skills and access."],
["Which is the best way to check if online news is reliable?",["Count the number of likes","Cross-check with several reliable sources","Check the font","See if it is long"],1,"Cross-checking."]]},
{id:"EC3",n:3,t:"Intellectual Property",sec:["3.1 Intellectual Property","3.2 Copyright","3.3 Copyright Infringement","3.4 Copyright in Education","3.5 Intellectual Property Protection","3.6 Software Licensing","3.7 Technology to Protect IP"],
cards:[
["Copyright","definition","作品创作完成即<b>自动</b>受保护，不需注册或声明。保护作品的表达，不保护意念。"],
["Software licences","definition","<b>Proprietary</b>（付费、不可改源码）、<b>Shareware</b>（试用）、<b>Freeware</b>（免费但不开源）、<b>Open source</b>（可看可改可分发，按 licence 如 GPL）、Public domain。Site licence / single-user licence。"],
["Creative Commons","definition","BY（署名）、NC（非商业）、ND（不可改作）、SA（相同方式分享）。"],
["保护 IP 的技术","property","DRM、license key / product activation、watermark、encryption。"]],
mc:[
["Which statement about copyright in Hong Kong is correct?",["It must be registered","It applies automatically when a work is created","It only covers software","It needs a © notice"],1,"Automatic protection."],
["Which licence allows users to view and modify the source code?",["Freeware","Shareware","Open source","Proprietary"],2,"Open source."],
["A CC BY-NC image can be",["sold commercially","used in a school project with credit","used without credit","claimed as your own"],1,"Non-commercial + attribution."]]}
]}
];
