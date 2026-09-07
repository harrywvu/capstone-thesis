% --- CCIS PAPER ---
% Template for writing Thesis and Capstone Projects
% College of Computing and Information Sciences
% version-1, authored by Louis Velasco

\NeedsTeXFormat{LaTeX2e}
\ProvidesClass{ccispaper}[2026/05/01 CCIS Thesis and Capstone Class]

\makeatletter

% --- Class Options Handling ---
\newif\if@bscs\@bscstrue
\DeclareOption{bscs}{\@bscstrue}
\DeclareOption{bsit}{\@bscsfalse}
\DeclareOption*{\PassOptionsToClass{\CurrentOption}{article}}
\ProcessOptions\relax

\LoadClass[12pt,final]{article}

% --- Required Packages ---
% zed-csp was removed because the template does not use its Z/CSP notation and
% it defines \mod before amsmath, which prevents current TeX engines from
% compiling the document.
\RequirePackage{changepage}
\RequirePackage[letterpaper,bindingoffset=0.2in,left=1.3in,right=1in,top=2in,bottom=1in]{geometry}
\RequirePackage{amsmath,amsthm,amsfonts,amssymb}
\RequirePackage{verbatim,float,algorithm}
\RequirePackage[noend]{algpseudocode}
\RequirePackage{setspace}
\RequirePackage{pdflscape,textpos}
\RequirePackage[title,titletoc]{appendix}
\RequirePackage[misc,alpine,geometry,electronic]{ifsym}
\RequirePackage{multirow,graphicx}
\graphicspath{{graphics/}}

% --- Typography ---
\RequirePackage[T1]{fontenc}
\RequirePackage[utf8]{inputenc}
\RequirePackage{mathptmx}

% --- Bibliography ---
\RequirePackage[backend=biber, sorting=none, style=ieee]{biblatex}

% --- Heading Formatting ---
\RequirePackage{titlesec}
\titleformat{\section}{\normalfont\Large\bfseries}{\thesection}{16pt}{}
\titleformat{\subsection}{\normalfont\large\bfseries}{\thesubsection}{14pt}{}
\titleformat{\subsubsection}{\normalfont\normalsize\bfseries}{\thesubsubsection}{12pt}{}

% --- Captions & Hyperlinks ---
\RequirePackage[font=it,justification=centering]{caption}
\RequirePackage[unicode=true, pdfusetitle,
  bookmarks=true,bookmarksnumbered=false,bookmarksopen=true,
  breaklinks=false,pdfborder={0 0 0},backref=false,colorlinks=false]{hyperref}

% --- Itemize & Theorem Customizations ---
\renewcommand{\labelitemi}{$-$}
\theoremstyle{plain}
\newtheorem{thm}{Theorem}
\theoremstyle{definition}
\newtheorem{dfn}{Definition}

% --- Table of Contents Settings ---
\renewcommand{\@dotsep}{10000} % Removes dots in ToC

\setcounter{secnumdepth}{5}
\setcounter{tocdepth}{5}
\renewcommand{\contentsname}{Table of Contents}

% --- Page Style ---
\pagestyle{myheadings}

% --- Metadata Command Definitions ---
\newcommand{\papertitle}[1]{\def\ccis@papertitle{#1}}
\newcommand{\paperauthors}[1]{\def\ccis@paperauthors{#1}}
\newcommand{\pubmonth}[1]{\def\ccis@pubmonth{#1}}
\newcommand{\pubyear}[1]{\def\ccis@pubyear{#1}}
\newcommand{\adviser}[1]{\def\ccis@adviser{#1}}
\newcommand{\examdate}[1]{\def\ccis@examdate{#1}}

% Default Dean's Name
\newcommand{\ccis@dean}{SATURNINA F. NISPEROS}

% User Setter Command for main.tex
\newcommand{\dean}[1]{\renewcommand{\ccis@dean}{#1}}

% Default Values
\def\ccis@papertitle{DOCUMENT TITLE}
\def\ccis@paperauthors{AUTHOR A. ONE \\ AUTHOR B. TWO \\ AUTHOR C. THREE \\ AUTHOR D. FOUR}
\def\ccis@pubmonth{May}
\def\ccis@pubyear{2026}
\def\ccis@adviser{ADVISER A. ADVISER}
\def\ccis@examdate{May 5, 2026}

% --- Dynamic Variables for BSCS vs BSIT ---
\newcommand{\ccis@deptname}{\if@bscs Department of Computer Science\else Department of Information Technology\fi}
\newcommand{\ccis@degreename}{\if@bscs Bachelor of Science in Computer Science\else Bachelor of Science in Information Technology\fi}
\newcommand{\ccis@degreenameupper}{\if@bscs BACHELOR OF SCIENCE IN COMPUTER SCIENCE\else BACHELOR OF SCIENCE IN INFORMATION TECHNOLOGY\fi}
\newcommand{\ccis@doclabel}{\if@bscs THESIS\else CAPSTONE PROJECT\fi}
\newcommand{\ccis@docdescript}{\if@bscs A Thesis Presented to the Faculty of College\else A Capstone Project Presented to the Faculty of College\fi}
\newcommand{\ccis@docinline}{\if@bscs thesis\else capstone project\fi}

% --- Cover Page Generator ---
\newcommand{\makecoverpage}{%
  \thispagestyle{empty}%
  \begin{center}%
    \textbf{\ccis@papertitle} \\
    \hfill\break\hfill\break\hfill\break\hfill\break
    \ccis@doclabel \\
    \hfill\break\hfill\break\hfill\break\hfill\break
    \ccis@paperauthors \\
    \hfill\break\hfill\break\hfill\break
    \includegraphics[width=1in, height=1in]{mmsulogo} 
    \includegraphics[width=1in, height=1in]{ccislogo} \\
    \hfill\break\hfill\break\hfill\break
    \textbf{\ccis@deptname} \\
    \textbf{COLLEGE OF COMPUTING AND INFORMATION SCIENCES} \\ 
    \textbf{Mariano Marcos State University} \\
    \textbf{City of Batac 2906 Ilocos Norte} \\
    \hfill\break\hfill\break\hfill\break\hfill\break\hfill\break\hfill\break\hfill\break
    \ccis@pubmonth\ \ccis@pubyear \\
  \end{center}%
  \newpage
}

% --- Title Page Generator ---
\newcommand{\maketitlepage}{%
  \thispagestyle{empty}%
  \pagenumbering{roman}%
  \setcounter{page}{1}%
  \phantomsection
  \addcontentsline{toc}{section}{Title Page}%
  \begin{center}%
    \textbf{\ccis@papertitle} \\
    \hfill\break\hfill\break
    \begin{doublespace}%
      \ccis@docdescript \\ of Computing and Information Sciences - \ccis@deptname
    \end{doublespace}%
    \hfill\break\hfill\break\hfill\break\hfill\break\hfill\break\hfill\break
    \begin{doublespace}%
      In Partial Fulfillment of the Requirements for the Degree \\ \ccis@degreename
    \end{doublespace}%
    \hfill\break\hfill\break\hfill\break\hfill\break
    By \\
    \hfill\break
    \ccis@paperauthors \\
    \hfill\break\hfill\break\hfill\break\hfill\break
    \ccis@pubmonth\ \ccis@pubyear \\
  \end{center}%
  \newpage
}

% --- Approval Sheet Generator ---
\newcommand{\makeapprovalsheet}[3]{% #1: Chairman, #2: Member 1, #3: Member 2
  \phantomsection
  \addcontentsline{toc}{section}{Approval Sheet}%
  \begin{center}%
    \textbf{APPROVAL SHEET}%
  \end{center}%
  \begin{doublespace}%
    \begingroup
      \def\\{\unskip, \ignorespaces}%
      \hspace*{0.2in}This \ccis@docinline\ titled, \textbf{"\ccis@papertitle"}, prepared and submitted by \ccis@paperauthors\ in partial fulfilment of the requirements for the degree \ccis@degreename, has been examined and recommended for acceptance and approval for the oral examination.
    \endgroup
  \end{doublespace}%
  \hfill\break
  \hspace*{10cm}\textbf{\ccis@adviser}\\
  \hspace*{11.50cm}Adviser
  \hfill\break
  \rule{\linewidth}{0.4pt}
  \begin{center}%
    \textbf{PANEL OF EXAMINERS}%
  \end{center}%
  \begin{doublespace}%
    \hspace*{0.2in}Approved by the Committee on Oral Examination in partial fulfillment of the requirements for the degree \ccis@degreename\ on \ccis@examdate.\\
  \end{doublespace}%
  
  \vspace{1em}%
  
  % Chairman Block (Centered)
  \begin{center}
    \textbf{#1}\\[0.2em]
    Chairman
  \end{center}%
  
  \vspace{1.5em}%
  
  % Members Block (Two Equal Columns)
  \noindent
  \begin{minipage}[t]{0.5\textwidth}
    \centering
    \textbf{#2}\\[0.2em]
    Member
  \end{minipage}%
  \begin{minipage}[t]{0.5\textwidth}
    \centering
    \textbf{#3}\\[0.2em]
    Member
  \end{minipage}%
  
  \vspace{2.5em}%
  
  \begin{doublespace}%
    \hspace*{0.2in}Accepted in partial fulfillment of the requirements for the degree of \ccis@degreenameupper.
  \end{doublespace}%
  \hfill\break
  \hspace*{1cm}\rule{4cm}{0.4pt}\hspace*{2cm}\textbf{\ccis@dean}\\
  \hspace*{2.7cm}Date\hspace*{5.8cm}Dean
  \newpage
}

% --- CV Entry Helper Command ---
\newcommand{\cventry}[3]{% #1: Title/Degree, #2: Institution/Org, #3: Date/Location
  \noindent\hspace*{0.7cm}%
  \begin{minipage}{\dimexpr\linewidth-0.7cm\relax}
    #1 \ifx&#3&\else\hfill (#3)\fi\par
    \textit{#2}\par
  \end{minipage}\par\vspace{1em}%
}

% --- Custom CV Generator Command ---
\newcommand{\makecv}[7]{%
  % #1: Name
  % #2: Photo filename
  % #3: Email
  % #4: Phone
  % #5: Education
  % #6: Trainings
  % #7: Awards
  \newpage
  \phantomsection
  %\addcontentsline{toc}{section}{Curriculum Vitae}%
  \begin{center}%
    \textbf{CURRICULUM VITAE}%
  \end{center}%
  \vspace{2em}%
  
  \vbox to 0pt{\hfill\fbox{\includegraphics[height=4cm]{#2}}}%
  \noindent\textbf{#1}\\[0.5em]
  % Item 1: Department + Address Block
  \begin{tabular}{@{} l @{\hspace{0.25cm}} l @{}}
    \makebox[0.5cm][c]{\PaperLandscape} & \ccis@deptname \\
    & College of Computing and Information Sciences \\
    & Mariano Marcos State University \\
    & City of Batac, Ilocos Norte, Philippines \\[0.3em]
    \makebox[0.5cm][c]{\Letter} & #3 \\[0.3em]
    \makebox[0.5cm][c]{\FilledSquareShadowC} & #4
  \end{tabular}
  \par\vspace{2em}

  \noindent\textbf{Educational Background}\par\vspace{0.5em}
  #5
  \vspace{1em}

  \noindent\textbf{Trainings and Seminars}\par\vspace{0.5em}
  #6
  \vspace{1em}

  \noindent\textbf{Awards and Certifications}\par\vspace{0.5em}
  #7
}

% --- Appendices Cover Page Generator ---
\newcommand{\makeappendices}{%
  \newpage
  \phantomsection
  \addcontentsline{toc}{section}{Appendices}%
  \vspace*{\fill}
  \begin{center}
    \huge\textbf{APPENDICES}
  \end{center}
  \vspace*{\fill}
  \newpage
}

% --- Dynamic Chapter Loader ---
\newcommand{\inputchapter}[1]{%
	\if@bscs
	\input{chapters/bscs/#1}%
	\else
	\input{chapters/bsit/#1}%
	\fi
}

\makeatother
